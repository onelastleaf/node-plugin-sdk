import { grpc, protocol } from './protocol.js';
import { Sender } from './sender.js';
import { Session } from './session.js';
import {
  validateEndpoint,
  validateNonemptyString,
  validatePluginId,
} from './validation.js';

export const GRPC_CHANNEL_OPTIONS = Object.freeze({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1,
});

export class Plugin {
  #id;
  #version;
  #actions = new Map();
  #running = false;

  constructor(id, version) {
    this.#id = validatePluginId(id);
    this.#version = validateNonemptyString(version, 'plugin version');
  }

  action(name, description, handler) {
    if (this.#running) throw new Error('cannot register actions while the plugin is running');
    validateNonemptyString(name, 'action name');
    if (typeof description !== 'string') throw new TypeError('action description must be a string');
    if (typeof handler !== 'function') throw new TypeError('action handler must be a function');
    if (this.#actions.has(name)) throw new Error(`duplicate action ${name}`);
    this.#actions.set(name, { description, handler });
    return this;
  }

  async run({ endpoint = process.env.OLL_PLUGIN_ENDPOINT, stdin = process.stdin } = {}) {
    if (this.#running) throw new Error('plugin runtime is already running');
    validateParentLivenessStream(stdin);
    const target = validateEndpoint(endpoint);
    this.#running = true;
    let parentEnded = Boolean(stdin.readableEnded);
    let client;
    let stream;
    let sender;
    let listeningForParent = false;
    const parentEOF = () => {
      parentEnded = true;
      stream?.cancel();
    };

    try {
      if (parentEnded) return;
      client = new protocol.PluginRuntime(
        target,
        grpc.credentials.createInsecure(),
        GRPC_CHANNEL_OPTIONS,
      );
      stream = client.connect();
      sender = new Sender(stream);
      stdin.once('end', parentEOF);
      listeningForParent = true;
      stdin.resume();
      if (parentEnded) parentEOF();

      const session = new Session({
        pluginId: this.#id,
        pluginVersion: this.#version,
        actions: new Map(this.#actions),
        stream,
        sender,
      });
      await session.run();
    } catch (error) {
      if (!parentEnded) throw error;
    } finally {
      if (listeningForParent) {
        stdin.off('end', parentEOF);
        stdin.pause();
      }
      sender?.close();
      if (stream) {
        try {
          stream.end();
        } catch {
          // A cancelled gRPC stream is already closed.
        }
      }
      client?.close();
      this.#running = false;
    }
  }
}

function validateParentLivenessStream(stdin) {
  if (!stdin
      || typeof stdin.once !== 'function'
      || typeof stdin.off !== 'function'
      || typeof stdin.resume !== 'function'
      || typeof stdin.pause !== 'function') {
    throw new TypeError('stdin must be a readable parent-liveness stream');
  }
}
