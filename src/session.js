import { Host } from './host.js';
import { JobManager } from './jobs.js';
import { HostError } from './errors.js';
import {
  assertCanonicalUuidV4,
  assertRecord,
  parseUnsigned64,
  tracesEqual,
  validateNonemptyString,
  validatePluginName,
  validateTimestamp,
  validateTrace,
  validateUint32,
} from './validation.js';

const MAXIMUM_UINT32 = 0xffff_ffff;
const UNNEGOTIATED_LIMITS = Object.freeze({
  maximumCallDepth: MAXIMUM_UINT32,
  maximumCausalDepth: MAXIMUM_UINT32,
});

export class Session {
  #pluginId;
  #pluginVersion;
  #actions;
  #stream;
  #sender;
  #host;
  #jobs;
  #lastHostMessageId = 0n;
  #limits;
  #fatalError;
  #background = new Set();

  constructor({ pluginId, pluginVersion, actions, stream, sender }) {
    this.#pluginId = pluginId;
    this.#pluginVersion = pluginVersion;
    this.#actions = actions;
    this.#stream = stream;
    this.#sender = sender;
  }

  async run() {
    const iterator = this.#stream[Symbol.asyncIterator]();
    try {
      const first = await this.#next(iterator, UNNEGOTIATED_LIMITS);
      if (first.replyTo !== undefined || first.payload !== 'hostHello') {
        throw new Error('HostHello must be the first host message');
      }
      validateNonemptyString(first.sessionId, 'plugin session ID');
      validateNonemptyString(first.pluginInstanceId, 'plugin instance ID');
      this.#limits = validateHostHello(this.#pluginId, first.hostHello);
      validateTrace(first.trace, this.#limits);
      this.#sender.setIdentity(first.sessionId, first.pluginInstanceId);

      await this.#sender.send(undefined, first.trace, {
        pluginHello: {
          pluginId: { value: this.#pluginId },
          pluginName: first.hostHello.pluginName,
          actions: [...this.#actions].map(([name, action]) => ({
            name,
            description: action.description,
          })),
          pluginVersion: this.#pluginVersion,
        },
      });

      const ready = await this.#next(iterator, this.#limits);
      if (ready.replyTo !== undefined
          || ready.payload !== 'ready'
          || !tracesEqual(ready.trace, first.trace)) {
        throw new Error('host SessionReady must follow PluginHello with the handshake trace');
      }
      await this.#sender.send(undefined, ready.trace, { ready: {} });

      this.#host = new Host(
        this.#sender,
        first.hostHello.maximumArtifactChunkBytes,
        first.hostHello.maximumCallDepth,
        first.sessionId,
      );
      this.#jobs = new JobManager(
        this.#actions,
        this.#sender,
        this.#host,
        (error) => this.#fail(error),
      );
      await this.#serve(iterator);
    } catch (error) {
      this.#fail(error);
      throw this.#fatalError;
    } finally {
      this.#jobs?.close('plugin session ended');
      this.#host?.close(this.#fatalError);
    }
  }

  async #serve(iterator) {
    while (true) {
      const envelope = await this.#next(iterator, this.#limits);
      if (envelope.replyTo !== undefined) {
        this.#host.route(envelope);
        continue;
      }
      switch (envelope.payload) {
        case 'startJob':
          this.#jobs.start(envelope);
          break;
        case 'cancelJob':
          this.#jobs.cancel(envelope);
          break;
        case 'heartbeat':
          this.#sendInBackground(() => this.#sender.send(
            envelope.messageId,
            envelope.trace,
            { heartbeat: envelope.heartbeat },
          ));
          break;
        case 'shutdown':
          validateNonemptyString(envelope.shutdown?.reason, 'shutdown reason');
          validateTimestamp(
            envelope.shutdown.gracePeriodDeadline,
            'shutdown grace-period deadline',
          );
          await this.#jobs.shutdown(envelope.shutdown.reason);
          await this.#drainBackground();
          this.#host.close(new Error('plugin is shutting down'));
          await this.#sender.send(envelope.messageId, envelope.trace, {
            shutdownAcknowledged: {},
          });
          return;
        case 'protocolError':
          throw new HostError(envelope.protocolError);
        default:
          throw new Error('unexpected host-initiated message');
      }
    }
  }

  async #next(iterator, limits) {
    let result;
    try {
      result = await iterator.next();
    } catch (error) {
      throw this.#fatalError ?? error;
    }
    if (result.done || !result.value) {
      throw this.#fatalError ?? new Error('host closed the plugin stream');
    }
    const envelope = result.value;
    this.#lastHostMessageId = validateEnvelope(
      envelope,
      this.#lastHostMessageId,
      this.#sender.sessionId,
      this.#sender.pluginInstanceId,
      limits,
    );
    return envelope;
  }

  #sendInBackground(operation) {
    let task;
    try {
      task = operation();
    } catch (error) {
      this.#fail(error);
      return;
    }
    const promise = Promise.resolve(task);
    this.#background.add(promise);
    const observation = promise.then(
      () => { this.#background.delete(promise); },
      (error) => {
        this.#background.delete(promise);
        this.#fail(error);
      },
    );
    observation.catch(() => {});
  }

  async #drainBackground() {
    while (this.#background.size > 0) {
      await Promise.allSettled([...this.#background]);
    }
    if (this.#fatalError) throw this.#fatalError;
  }

  #fail(error) {
    if (this.#fatalError) return;
    this.#fatalError = error instanceof Error ? error : new Error(String(error));
    try {
      this.#stream.cancel();
    } catch {
      // The original session error is the useful failure.
    }
  }
}

function validateEnvelope(
  envelope,
  lastMessageId,
  sessionId,
  pluginInstanceId,
  limits,
) {
  assertRecord(envelope, 'plugin envelope');
  const messageId = parseUnsigned64(envelope.messageId, 'host message ID');
  if (messageId === 0n || messageId <= lastMessageId) {
    throw new Error('host message IDs must be nonzero and strictly increasing');
  }
  if (sessionId
      && (envelope.sessionId !== sessionId || envelope.pluginInstanceId !== pluginInstanceId)) {
    throw new Error('host envelope belongs to another plugin instance');
  }
  validateTrace(envelope.trace, limits);
  validateNonemptyString(envelope.payload, 'host envelope payload');
  if (envelope.replyTo !== undefined) {
    const replyTo = parseUnsigned64(envelope.replyTo, 'host reply target');
    if (replyTo === 0n) throw new Error('host reply target must be nonzero');
  }
  return messageId;
}

function validateHostHello(pluginId, hello) {
  assertRecord(hello, 'HostHello');
  assertRecord(hello.node, 'HostHello node identity');
  assertCanonicalUuidV4(hello.node.nodeId?.value, 'HostHello node ID');
  validatePluginName(hello.node.nodeName?.value);
  if (hello.pluginId?.value !== pluginId) {
    throw new Error('HostHello names another plugin ID');
  }
  validatePluginName(hello.pluginName?.value);
  const maximumCallDepth = validateUint32(
    hello.maximumCallDepth,
    'maximum call depth',
    { nonzero: true },
  );
  const maximumCausalDepth = validateUint32(
    hello.maximumCausalDepth,
    'maximum causal depth',
    { nonzero: true },
  );
  const maximumArtifactChunkBytes = parseUnsigned64(
    hello.maximumArtifactChunkBytes,
    'maximum artifact chunk size',
  );
  if (maximumArtifactChunkBytes === 0n) {
    throw new Error('maximum artifact chunk size must be nonzero');
  }
  return { maximumCallDepth, maximumCausalDepth, maximumArtifactChunkBytes };
}
