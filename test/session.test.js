import assert from 'node:assert/strict';
import test from 'node:test';
import { ActionResult } from '../src/result.js';
import { GRPC_CHANNEL_OPTIONS } from '../src/plugin.js';
import { Sender } from '../src/sender.js';
import { Session } from '../src/session.js';
import { deferred, TRACE } from './support.js';

test('Node gRPC transport explicitly disables both default message caps', () => {
  assert.deepEqual(GRPC_CHANNEL_OPTIONS, {
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1,
  });
  assert(Object.isFrozen(GRPC_CHANNEL_OPTIONS));
});

test('reader answers heartbeat while an uncooperative action is cancelling', async () => {
  const stream = new FakeDuplex();
  const sender = new Sender(stream);
  const entered = deferred();
  const release = deferred();
  const actions = new Map([['wait', {
    description: 'wait for release',
    handler: async (context) => {
      entered.resolve(context.signal);
      await release.promise;
      return new ActionResult();
    },
  }]]);
  const session = new Session({
    pluginId: 'org.onelastleaf.conformance',
    pluginVersion: '0.1.0',
    actions,
    stream,
    sender,
  });
  const running = session.run();

  stream.push(hostEnvelope(1, TRACE, 'hostHello', hostHello()));
  assert((await stream.output()).pluginHello);

  stream.push(hostEnvelope(2, TRACE, 'ready', {}));
  assert((await stream.output()).ready);

  const jobTrace = {
    correlationId: '00000000-0000-4000-8000-000000000010',
    callDepth: 0,
    causalDepth: 0,
  };
  stream.push(hostEnvelope(3, jobTrace, 'startJob', {
    jobId: { value: JOB_ID },
    invocation: 'action',
    action: { action: 'wait', arguments: [] },
  }));
  assert((await stream.output()).jobAccepted);
  const signal = await entered.promise;

  stream.push(hostEnvelope(4, jobTrace, 'cancelJob', {
    jobId: { value: JOB_ID },
    reason: 'JOB_CANCELLATION_REASON_USER_REQUEST',
  }));
  const heartbeatTrace = {
    correlationId: '00000000-0000-4000-8000-000000000014',
    callDepth: 0,
    causalDepth: 0,
  };
  stream.push(hostEnvelope(5, heartbeatTrace, 'heartbeat', { nonce: '42' }));
  const heartbeat = await stream.output();
  assert.equal(heartbeat.replyTo, '5');
  assert.equal(heartbeat.heartbeat.nonce, '42');
  assert.equal(signal.aborted, true);

  release.resolve();
  const cancellation = await stream.output();
  assert.equal(cancellation.replyTo, '4');
  assert.equal(cancellation.cancelJobAcknowledged.jobId.value, JOB_ID);

  const shutdownTrace = {
    correlationId: '00000000-0000-4000-8000-000000000050',
    callDepth: 0,
    causalDepth: 0,
  };
  stream.push(hostEnvelope(6, shutdownTrace, 'shutdown', {
    reason: 'test complete',
    gracePeriodDeadline: { seconds: '253402300799', nanos: 0 },
  }));
  const shutdown = await stream.output();
  assert(shutdown.shutdownAcknowledged);
  assert.equal(shutdown.replyTo, '6');
  await running;
  assert.equal(stream.cancelled, false);
});

test('a malformed session identity fails the session and cancels transport work', async () => {
  const stream = new FakeDuplex();
  const session = new Session({
    pluginId: 'org.onelastleaf.conformance',
    pluginVersion: '0.1.0',
    actions: new Map(),
    stream,
    sender: new Sender(stream),
  });
  const running = assert.rejects(session.run(), /session ID/);
  stream.push({
    ...hostEnvelope(1, TRACE, 'hostHello', {}),
    sessionId: '',
  });
  await running;
  assert.equal(stream.cancelled, true);
});

test('shutdown requires the host-owned reason and grace deadline', async () => {
  const stream = new FakeDuplex();
  const session = new Session({
    pluginId: 'org.onelastleaf.conformance',
    pluginVersion: '0.1.0',
    actions: new Map(),
    stream,
    sender: new Sender(stream),
  });
  const running = session.run();
  stream.push(hostEnvelope(1, TRACE, 'hostHello', hostHello()));
  assert((await stream.output()).pluginHello);
  stream.push(hostEnvelope(2, TRACE, 'ready', {}));
  assert((await stream.output()).ready);

  const rejected = assert.rejects(running, /shutdown reason/);
  stream.push(hostEnvelope(3, TRACE, 'shutdown', {
    reason: '',
    gracePeriodDeadline: { seconds: '253402300799', nanos: 0 },
  }));
  await rejected;
  assert.equal(stream.cancelled, true);
});

const JOB_ID = '00000000-0000-4000-8000-000000000011';

function hostEnvelope(messageId, trace, payload, value) {
  return {
    messageId: String(messageId),
    sessionId: 'sdk-conformance-session',
    pluginInstanceId: 'sdk-conformance-instance',
    trace: structuredClone(trace),
    payload,
    [payload]: value,
  };
}

function hostHello() {
  return {
    node: {
      nodeId: { value: '00000000-0000-4000-8000-000000000002' },
      nodeName: { value: 'conformance-host' },
    },
    maximumCallDepth: 8,
    maximumCausalDepth: 8,
    maximumArtifactChunkBytes: '65536',
    pluginId: { value: 'org.onelastleaf.conformance' },
    pluginName: { value: 'conformance-fixture' },
  };
}

class FakeDuplex {
  #incoming = [];
  #incomingWaiters = [];
  #outgoing = [];
  #outgoingWaiters = [];
  cancelled = false;

  [Symbol.asyncIterator]() { return this; }

  next() {
    if (this.#incoming.length > 0) return Promise.resolve({ value: this.#incoming.shift() });
    if (this.cancelled) return Promise.reject(new Error('stream cancelled'));
    const waiter = deferred();
    this.#incomingWaiters.push(waiter);
    return waiter.promise;
  }

  push(envelope) {
    const waiter = this.#incomingWaiters.shift();
    if (waiter) waiter.resolve({ value: envelope });
    else this.#incoming.push(envelope);
  }

  write(envelope, callback) {
    const waiter = this.#outgoingWaiters.shift();
    if (waiter) waiter.resolve(envelope);
    else this.#outgoing.push(envelope);
    queueMicrotask(() => callback(undefined));
  }

  output() {
    if (this.#outgoing.length > 0) return Promise.resolve(this.#outgoing.shift());
    const waiter = deferred();
    this.#outgoingWaiters.push(waiter);
    return waiter.promise;
  }

  cancel() {
    if (this.cancelled) return;
    this.cancelled = true;
    for (const waiter of this.#incomingWaiters.splice(0)) {
      waiter.reject(new Error('stream cancelled'));
    }
  }
}
