import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { HostError } from '../src/errors.js';
import { JobManager } from '../src/jobs.js';
import { ActionResult } from '../src/result.js';
import {
  cancelEnvelope,
  deferred,
  eventually,
  RecordingSender,
  startEnvelope,
  TRACE,
} from './support.js';

test('a synchronous handler throw becomes one failed terminal update', async () => {
  const { manager, sender, fatals } = fixture(() => { throw new Error('sync failure'); });
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal(sender.messages[0].jobAccepted.jobId.value, JOB_ID);
  assert.equal(update.jobUpdate.state, 'JOB_STATE_FAILED');
  assert.equal(update.jobUpdate.error.code, 'ERROR_CODE_INTERNAL');
  assert.equal(update.jobUpdate.error.message, 'sync failure');
  await manager.drain();
  assert.deepEqual(fatals, []);
});

test('an invalid handler return fails only its job', async () => {
  const { manager, sender, fatals } = fixture(() => ({ result: { stringValue: 'not branded' } }));
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal(update.jobUpdate.state, 'JOB_STATE_FAILED');
  assert.match(update.jobUpdate.error.message, /ActionResult/);
  await manager.drain();
  assert.deepEqual(fatals, []);
});

test('structured HostError fields survive an uncaught action failure', async () => {
  const error = new HostError({
    code: 'ERROR_CODE_UNAVAILABLE',
    message: 'try another host',
    retryable: true,
    metadata: { host: 'one' },
    details: [{ type_url: 'type.example/retry', value: Buffer.from('later') }],
  });
  const { manager, sender } = fixture(() => { throw error; });
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.deepEqual(update.jobUpdate.error, {
    code: 'ERROR_CODE_UNAVAILABLE',
    message: 'try another host',
    retryable: true,
    metadata: { host: 'one' },
    details: error.details,
  });
});

test('terminal send failure is supervised without an unhandled rejection', async () => {
  const unhandled = [];
  const listener = (error) => unhandled.push(error);
  process.on('unhandledRejection', listener);
  try {
    const sender = new RecordingSender();
    sender.failure = (message) => Boolean(message.jobUpdate);
    const fatals = [];
    const manager = new JobManager(
      new Map([['test', { description: '', handler: () => ActionResult.string('ok') }]]),
      sender,
      fakeHost(),
      (error) => fatals.push(error),
    );
    await manager.start(startEnvelope());
    await manager.drain();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(fatals.length, 1);
    assert.match(fatals[0].message, /injected send failure/);
    assert.deepEqual(unhandled, []);
  } finally {
    process.off('unhandledRejection', listener);
  }
});

test('cancellation does not block dispatch and acknowledges only after the handler ceases', async () => {
  const entered = deferred();
  const release = deferred();
  let signal;
  const { manager, sender } = fixture(async (context) => {
    signal = context.signal;
    entered.resolve();
    await release.promise;
    return ActionResult.string('too late');
  });
  await manager.start(startEnvelope());
  await entered.promise;
  assert.equal(manager.cancel(cancelEnvelope()), undefined);
  assert.equal(signal.aborted, true);
  assert.equal(sender.messages.some((message) => message.cancelJobAcknowledged), false);
  assert.equal(sender.messages.some((message) => message.jobUpdate), false);

  release.resolve();
  const acknowledged = await eventually(() =>
    sender.messages.find((message) => message.cancelJobAcknowledged));
  assert.equal(acknowledged.replyTo, '2');
  assert.equal(acknowledged.cancelJobAcknowledged.jobId.value, JOB_ID);
  assert.equal(sender.messages.some((message) => message.jobUpdate), false);
  await manager.drain();
});

test('job admission stays cancellable while its acceptance write is backpressured', async () => {
  const acceptance = deferred();
  const messages = [];
  const sender = {
    send(replyTo, trace, payload) {
      messages.push({ replyTo, trace, ...payload });
      if (payload.jobAccepted) return acceptance.promise;
      return Promise.resolve(2n);
    },
  };
  let handlerCalls = 0;
  const fatals = [];
  const manager = new JobManager(new Map([['test', {
    description: '',
    handler: () => {
      handlerCalls += 1;
      return new ActionResult();
    },
  }]]), sender, fakeHost(), (error) => fatals.push(error));

  manager.start(startEnvelope());
  manager.cancel(cancelEnvelope());
  assert.equal(handlerCalls, 0);
  assert.equal(messages.some((message) => message.cancelJobAcknowledged), false);
  acceptance.resolve(1n);
  await manager.drain();
  assert.equal(handlerCalls, 0);
  assert.equal(messages.filter((message) => message.cancelJobAcknowledged).length, 1);
  assert.deepEqual(fatals, []);
});

test('a late or unknown valid cancellation is idempotently acknowledged', async () => {
  const { manager, sender } = fixture(() => ActionResult.string('complete'));
  await manager.start(startEnvelope());
  await eventually(() => sender.messages.find((message) => message.jobUpdate));
  manager.cancel(cancelEnvelope());
  await eventually(() => sender.messages.find((message) => message.cancelJobAcknowledged));
  assert.equal(sender.messages.filter((message) => message.jobUpdate).length, 1);

  manager.cancel(cancelEnvelope({
    messageId: '3',
    jobId: '00000000-0000-4000-8000-000000000099',
  }));
  await eventually(() => sender.messages.filter((message) =>
    message.cancelJobAcknowledged).length === 2);
  assert.equal(sender.messages.filter((message) => message.jobUpdate).length, 1);
});

test('a crossing cancellation that is dispatched first suppresses completion', async () => {
  const release = deferred();
  const { manager, sender } = fixture(async () => {
    await release.promise;
    return ActionResult.string('raced');
  });
  await manager.start(startEnvelope());
  release.resolve();
  manager.cancel(cancelEnvelope());
  await eventually(() => sender.messages.find((message) => message.cancelJobAcknowledged));
  assert.equal(sender.messages.some((message) => message.jobUpdate), false);
});

test('the SDK does not invent a local job deadline timer', async () => {
  const entered = deferred();
  const release = deferred();
  let signal;
  const { manager } = fixture(async (context) => {
    signal = context.signal;
    entered.resolve();
    await release.promise;
    return new ActionResult();
  });
  await manager.start(startEnvelope({ deadline: { seconds: '0', nanos: 0 } }));
  await entered.promise;
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(signal.aborted, false);
  manager.cancel(cancelEnvelope());
  release.resolve();
  await manager.drain();
});

test('ActionContext has a curated boundary and rejects unstored artifact results', async () => {
  const artifact = artifactDescriptor();
  let contextKeys;
  const { manager, sender } = fixture((context) => {
    contextKeys = Object.keys(context).sort();
    return new ActionResult({ stringValue: 'bad artifact' }, [artifact]);
  });
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal('host' in Object.fromEntries(contextKeys.map((key) => [key, true])), false);
  assert.equal(update.jobUpdate.state, 'JOB_STATE_FAILED');
  assert.match(update.jobUpdate.error.message, /not stored by this job/);
});

test('stored artifacts can be referenced by the terminal result', async () => {
  const artifact = artifactDescriptor();
  const host = fakeHost();
  const sender = new RecordingSender();
  const fatals = [];
  const manager = new JobManager(new Map([['test', {
    description: '',
    handler: async (context) => {
      await context.storeArtifact(artifact, [Buffer.from('payload')]);
      return new ActionResult({ stringValue: 'stored' }, [artifact]);
    },
  }]]), sender, host, (error) => fatals.push(error));
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal(update.jobUpdate.state, 'JOB_STATE_SUCCEEDED');
  assert.deepEqual(update.jobUpdate.artifacts, [artifact]);
  assert.equal(host.stored.length, 1);
  await manager.drain();
  assert.deepEqual(fatals, []);
});

test('mutating an artifact after storage cannot rewrite the acknowledged descriptor', async () => {
  const artifact = artifactDescriptor();
  const host = fakeHost();
  const sender = new RecordingSender();
  const fatals = [];
  const manager = new JobManager(new Map([['test', {
    description: '',
    handler: async (context) => {
      const storing = context.storeArtifact(artifact, [Buffer.from('payload')]);
      artifact.fileName = 'changed.txt';
      await storing;
      return new ActionResult(undefined, [artifact]);
    },
  }]]), sender, host, (error) => fatals.push(error));
  await manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal(host.stored[0].fileName, 'result.txt');
  assert.equal(update.jobUpdate.state, 'JOB_STATE_FAILED');
  assert.match(update.jobUpdate.error.message, /not stored by this job/);
  await manager.drain();
  assert.deepEqual(fatals, []);
});

test('concurrent artifact stores cannot reuse one transfer ID', async () => {
  const artifact = artifactDescriptor();
  const gate = deferred();
  let transfers = 0;
  const host = {
    ...fakeHost(),
    async storeArtifact(_trace, _jobId, descriptor) {
      transfers += 1;
      await gate.promise;
      return { artifactId: descriptor.artifactId };
    },
  };
  const sender = new RecordingSender();
  const fatals = [];
  const manager = new JobManager(new Map([['test', {
    description: '',
    handler: async (context) => {
      const first = context.storeArtifact(artifact, [Buffer.from('payload')]);
      await assert.rejects(
        context.storeArtifact(artifact, [Buffer.from('payload')]),
        /already used this artifact ID/,
      );
      gate.resolve();
      await first;
      return new ActionResult(undefined, [artifact]);
    },
  }]]), sender, host, (error) => fatals.push(error));
  manager.start(startEnvelope());
  const update = await eventually(() => sender.messages.find((message) => message.jobUpdate));
  assert.equal(transfers, 1);
  assert.equal(update.jobUpdate.state, 'JOB_STATE_SUCCEEDED');
  await manager.drain();
  assert.deepEqual(fatals, []);
});

test('invalid cancellation IDs and reasons remain protocol violations', () => {
  const { manager } = fixture(() => new ActionResult());
  assert.throws(() => manager.cancel(cancelEnvelope({ jobId: 'bad' })), /UUID v4/);
  assert.throws(() => manager.cancel(cancelEnvelope({
    reason: 'JOB_CANCELLATION_REASON_UNSPECIFIED',
  })), /invalid cancellation reason/);
});

const JOB_ID = '00000000-0000-4000-8000-000000000011';

function fixture(handler) {
  const sender = new RecordingSender();
  const fatals = [];
  const manager = new JobManager(
    new Map([['test', { description: '', handler }]]),
    sender,
    fakeHost(),
    (error) => fatals.push(error),
  );
  return { manager, sender, fatals };
}

function fakeHost() {
  return {
    maximumCallDepth: 8,
    stored: [],
    async call() { return { result: 'readDocument', readDocument: {} }; },
    async getConfig() { return { value: { stringValue: 'configured' } }; },
    async invokeConfigFunction() { return { results: [] }; },
    async log() {},
    async storeArtifact(_trace, _jobId, artifact) {
      this.stored.push(artifact);
      return { artifactId: artifact.artifactId };
    },
  };
}

function artifactDescriptor() {
  const bytes = Buffer.from('payload');
  return {
    artifactId: { value: '00000000-0000-4000-8000-000000000012' },
    fileName: 'result.txt',
    mediaType: 'text/plain',
    sizeBytes: String(bytes.length),
    sha256: createHash('sha256').update(bytes).digest(),
  };
}
