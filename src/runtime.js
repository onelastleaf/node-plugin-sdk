import net from 'node:net';
import { grpc, protocol } from './protocol.js';
import { Host } from './host.js';

export const PROTOCOL_SCHEMA_SHA256 = '9b236b37455965858413f5717a88e28568a459e81e87a28ff77be8845bcff75a';
const MAXIMUM_ENVELOPE_BYTES = 64 * 1024 * 1024;

export class Plugin {
  #id;
  #version;
  #actions = new Map();

  constructor(id, version) {
    validatePluginId(id);
    if (!version) throw new Error('plugin version must not be empty');
    this.#id = id;
    this.#version = version;
  }

  action(name, description, handler) {
    if (!name || typeof handler !== 'function') throw new Error('action name and handler are required');
    if (this.#actions.has(name)) throw new Error(`duplicate action ${name}`);
    this.#actions.set(name, { description, handler });
    return this;
  }

  async run({ endpoint = process.env.OLL_PLUGIN_ENDPOINT, stdin = process.stdin } = {}) {
    const target = validateEndpoint(endpoint);
    const client = new protocol.PluginRuntime(target, grpc.credentials.createInsecure(), {
      'grpc.max_receive_message_length': MAXIMUM_ENVELOPE_BYTES,
      'grpc.max_send_message_length': MAXIMUM_ENVELOPE_BYTES,
    });
    const stream = client.connect();
    const sender = new Sender(stream);
    let parentEnded = false;
    const parentEOF = () => {
      parentEnded = true;
      stream.cancel();
    };
    stdin.once('end', parentEOF);
    stdin.resume();
    try {
      const iterator = stream[Symbol.asyncIterator]();
      let lastHostMessageId = 0n;
      const first = value(await iterator.next());
      lastHostMessageId = validateEnvelope(first, lastHostMessageId);
      if (first.replyTo !== undefined || first.payload !== 'hostHello') {
        throw new Error('HostHello must be the first host message');
      }
      if (!first.sessionId || !first.pluginInstanceId) {
        throw new Error('HostHello envelope omitted its session or instance identity');
      }
      validateHello(this.#id, first.hostHello);
      validateTrace(first.trace, first.hostHello);
      sender.identity(first.sessionId, first.pluginInstanceId);
      await sender.send(undefined, first.trace, {
        pluginHello: {
          pluginId: { value: this.#id },
          pluginName: first.hostHello.pluginName,
          protocolSchemaSha256: Buffer.from(PROTOCOL_SCHEMA_SHA256, 'hex'),
          actions: [...this.#actions].map(([name, action]) => ({ name, description: action.description })),
          pluginVersion: this.#version,
        },
      });
      const ready = value(await iterator.next());
      lastHostMessageId = validateEnvelope(ready, lastHostMessageId, sender, first.hostHello);
      if (ready.replyTo !== undefined || ready.payload !== 'ready'
          || ready.trace.correlationId !== first.trace.correlationId) {
        throw new Error('host SessionReady must follow PluginHello');
      }
      await sender.send(undefined, first.trace, { ready: {} });
      const host = new Host(
        sender,
        first.hostHello.maximumArtifactChunkBytes,
        first.hostHello.maximumCallDepth,
      );
      await this.#serve(iterator, sender, host, lastHostMessageId, first.hostHello);
    } catch (error) {
      if (!parentEnded) throw error;
    } finally {
      stdin.off('end', parentEOF);
      stdin.pause();
      stream.end();
      client.close();
    }
  }

  async #serve(iterator, sender, host, lastHostMessageId, limits) {
    const jobs = new Map();
    try {
      while (true) {
        const envelope = value(await iterator.next());
        lastHostMessageId = validateEnvelope(envelope, lastHostMessageId, sender, limits);
        if (envelope.replyTo !== undefined) {
          host.route(envelope);
          continue;
        }
        if (envelope.payload === 'startJob') {
          await this.#startJob(envelope, sender, host, jobs);
        } else if (envelope.payload === 'cancelJob') {
          const id = envelope.cancelJob.jobId?.value;
          const job = jobs.get(id);
          if (!job) throw new Error('cancellation names no active job');
          job.abort.abort(new Error('job cancelled'));
          await job.settled;
          jobs.delete(id);
          await sender.send(envelope.messageId, envelope.trace, {
            cancelJobAcknowledged: { jobId: envelope.cancelJob.jobId },
          });
        } else if (envelope.payload === 'heartbeat') {
          await sender.send(envelope.messageId, envelope.trace, { heartbeat: envelope.heartbeat });
        } else if (envelope.payload === 'shutdown') {
          for (const job of jobs.values()) job.abort.abort(new Error('plugin shutdown'));
          await Promise.allSettled([...jobs.values()].map((job) => job.settled));
          await sender.send(envelope.messageId, envelope.trace, { shutdownAcknowledged: {} });
          return;
        } else if (envelope.payload === 'protocolError') {
          throw new Error(`host protocol error: ${envelope.protocolError.message}`);
        } else {
          throw new Error('unexpected host-initiated message');
        }
      }
    } finally {
      for (const job of jobs.values()) job.abort.abort(new Error('plugin session ended'));
      await Promise.allSettled([...jobs.values()].map((job) => job.settled));
    }
  }

  async #startJob(envelope, sender, host, jobs) {
    const request = envelope.startJob;
    const id = request.jobId?.value;
    if (!isCanonicalUuidV4(id) || jobs.has(id) || request.invocation !== 'action') {
      throw new Error('invalid StartJobRequest');
    }
    const registered = this.#actions.get(request.action.action);
    if (!registered) throw new Error(`unknown action ${request.action.action}`);
    await sender.send(envelope.messageId, envelope.trace, { jobAccepted: { jobId: request.jobId } });
    const abort = new AbortController();
    const deadlineTimer = deadlineTimeout(request.deadline, abort);
    const context = createActionContext({
      jobId: id,
      deadline: request.deadline,
      trace: structuredClone(envelope.trace),
      signal: abort.signal,
      host,
      parentCallId: envelope.messageId,
    });
    const settled = Promise.resolve(registered.handler(context, request.action.arguments ?? []))
      .then(async (result) => {
        if (abort.signal.aborted) return;
        await sender.send(undefined, envelope.trace, {
          jobUpdate: {
            jobId: request.jobId,
            state: 'JOB_STATE_SUCCEEDED',
            progress: 1,
            result: result?.result,
            artifacts: result?.artifacts ?? [],
          },
        });
      }, async (error) => {
        if (abort.signal.aborted) return;
        await sender.send(undefined, envelope.trace, {
          jobUpdate: {
            jobId: request.jobId,
            state: 'JOB_STATE_FAILED',
            progress: 1,
            error: { code: 'ERROR_CODE_INTERNAL', message: String(error?.message ?? error) },
          },
        });
      })
      .finally(() => {
        if (deadlineTimer !== undefined) clearTimeout(deadlineTimer);
        jobs.delete(id);
      });
    jobs.set(id, { abort, settled });
  }
}

function createActionContext({ jobId, deadline, trace, signal, host, parentCallId }) {
  const nestedTrace = () => {
    const nested = structuredClone(trace);
    nested.parentCallId = String(parentCallId);
    nested.callDepth = Number(nested.callDepth ?? 0) + 1;
    if (nested.callDepth > host.maximumCallDepth) {
      throw new Error('host call exceeds the negotiated call-depth limit');
    }
    return nested;
  };
  return {
    jobId,
    deadline,
    trace,
    signal,
    host,
    hostCall: (call) => host.call(nestedTrace(), call, { signal }),
    getConfig: (path) => host.getConfig(nestedTrace(), path, { signal }),
    invokeConfigFunction: (functionRef, arguments_) =>
      host.invokeConfigFunction(nestedTrace(), functionRef, arguments_, { signal }),
    log: (level, target, message, fields) => host.log(trace, level, target, message, fields),
    storeArtifact: (artifact, chunks) =>
      host.storeArtifact(trace, jobId, artifact, chunks, { signal }),
  };
}

class Sender {
  #stream;
  #nextId = 1n;
  #outstanding = 0;
  sessionId = '';
  instanceId = '';
  #tail = Promise.resolve();

  constructor(stream) { this.#stream = stream; }
  identity(sessionId, instanceId) { this.sessionId = sessionId; this.instanceId = instanceId; }
  #reserveId() {
    if (this.#nextId > 0xffffffffffffffffn) throw new Error('plugin exhausted message IDs');
    const value = this.#nextId;
    this.#nextId += 1n;
    return value;
  }
  send(replyTo, trace, payload, beforeWrite = undefined) {
    if (this.#outstanding >= 256) {
      return Promise.reject(new Error('plugin output queue is full'));
    }
    this.#outstanding += 1;
    const messageId = this.#reserveId();
    try {
      beforeWrite?.(messageId);
    } catch (error) {
      this.#outstanding -= 1;
      return Promise.reject(error);
    }
    const envelope = {
      messageId: messageId.toString(),
      ...(replyTo === undefined ? {} : { replyTo: replyTo.toString() }),
      sessionId: this.sessionId,
      pluginInstanceId: this.instanceId,
      trace: structuredClone(trace),
      ...payload,
    };
    const write = () => new Promise((resolve, reject) => {
      this.#stream.write(envelope, (error) => error ? reject(error) : resolve(messageId));
    });
    const current = this.#tail.then(write, write);
    this.#tail = current.catch(() => {});
    return current.finally(() => { this.#outstanding -= 1; });
  }
}

function value(result) {
  if (result.done || !result.value) throw new Error('host closed the plugin stream');
  return result.value;
}

function validateEnvelope(envelope, lastId, sender, limits) {
  const id = BigInt(envelope.messageId);
  if (id === 0n || id <= lastId) throw new Error('host message IDs must be nonzero and strictly increasing');
  if (sender && (envelope.sessionId !== sender.sessionId || envelope.pluginInstanceId !== sender.instanceId)) {
    throw new Error('host envelope belongs to another plugin instance');
  }
  if (!envelope.trace?.correlationId) throw new Error('host omitted correlation context');
  if (limits) validateTrace(envelope.trace, limits);
  return id;
}

function validateTrace(trace, limits) {
  if (Number(trace.callDepth ?? 0) > Number(limits.maximumCallDepth)) {
    throw new Error('host envelope exceeds maximum call depth');
  }
  if (Number(trace.causalDepth ?? 0) > Number(limits.maximumCausalDepth)) {
    throw new Error('host envelope exceeds maximum causal depth');
  }
}

function deadlineTimeout(deadline, abort) {
  if (!deadline) return undefined;
  const milliseconds = Number(deadline.seconds ?? 0) * 1000
    + Number(deadline.nanos ?? 0) / 1_000_000 - Date.now();
  if (milliseconds <= 0) {
    abort.abort(new Error('job deadline exceeded'));
    return undefined;
  }
  return setTimeout(() => abort.abort(new Error('job deadline exceeded')), milliseconds);
}

function validateHello(pluginId, hello) {
  if (!hello.node
      || !Buffer.from(hello.protocolSchemaSha256).equals(Buffer.from(PROTOCOL_SCHEMA_SHA256, 'hex'))
      || hello.pluginId?.value !== pluginId || !hello.pluginName?.value
      || !hello.maximumCallDepth || !hello.maximumCausalDepth || !hello.maximumArtifactChunkBytes) {
    throw new Error('HostHello does not describe the expected plugin instance');
  }
}

export function validatePluginId(value) {
  const labels = value.split('.');
  if (Buffer.byteLength(value) > 191 || labels.length < 2
      || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
    throw new Error('plugin ID must be a lower-case ASCII dotted DNS name');
  }
}

export function validateEndpoint(value) {
  let endpoint;
  try { endpoint = new URL(value); } catch { throw new Error('OLL_PLUGIN_ENDPOINT must be a URL'); }
  if (endpoint.protocol !== 'http:' || endpoint.username || endpoint.password
      || endpoint.pathname !== '/' || endpoint.search || endpoint.hash || !endpoint.port
      || !(endpoint.hostname === 'localhost' || isLoopbackAddress(endpoint.hostname))) {
    throw new Error('OLL_PLUGIN_ENDPOINT must be an http loopback URL with an explicit port');
  }
  return endpoint.host;
}

function isLoopback(host) {
  return host === '::1' || host.startsWith('127.');
}

function isLoopbackAddress(host) {
  const normalized = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  return net.isIP(normalized) !== 0 && isLoopback(normalized);
}

function isCanonicalUuidV4(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}
