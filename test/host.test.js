import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Host } from '../src/host.js';
import { HostError } from '../src/index.js';
import { deferred, eventually, RecordingSender, TRACE } from './support.js';

test('aborting a host request tolerates its valid late response', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const abort = new AbortController();
  const request = host.call(TRACE, {
    readDocument: { path: { value: '/one.md' }, projection: 'DOCUMENT_PROJECTION_CONTENT' },
  }, { signal: abort.signal });
  const sent = await eventually(() => sender.messages[0]);
  const rejected = assert.rejects(request, /cancelled/);
  abort.abort(new Error('cancelled'));
  await rejected;

  assert.doesNotThrow(() => host.route({
    replyTo: sent.messageId.toString(),
    trace: TRACE,
    payload: 'hostResult',
    hostResult: { result: 'readDocument', readDocument: { document: { content: 'late' } } },
  }));

  const next = host.call(TRACE, {
    readDocument: { path: { value: '/two.md' }, projection: 'DOCUMENT_PROJECTION_CONTENT' },
  });
  const nextSent = await eventually(() => sender.messages[1]);
  host.route({
    replyTo: nextSent.messageId.toString(),
    trace: TRACE,
    payload: 'hostResult',
    hostResult: { result: 'readDocument', readDocument: { document: { content: 'next' } } },
  });
  assert.equal((await next).readDocument.document.content, 'next');
});

test('a malformed late response is still a protocol violation', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const abort = new AbortController();
  const request = host.getConfig(TRACE, undefined, { signal: abort.signal });
  const sent = await eventually(() => sender.messages[0]);
  abort.abort(new Error('cancelled'));
  await assert.rejects(request, /cancelled/);
  assert.throws(() => host.route({
    replyTo: sent.messageId.toString(),
    trace: { ...TRACE, taskId: 'changed' },
    payload: 'hostResult',
    hostResult: { result: 'getConfig', getConfig: { value: { stringValue: 'late' } } },
  }), /changed trace context/);
});

test('host responses must preserve the complete trace, not only correlation', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const request = host.getConfig(TRACE);
  const sent = await eventually(() => sender.messages[0]);
  const rejected = assert.rejects(request, /changed trace context/);
  assert.throws(() => host.route({
    replyTo: sent.messageId.toString(),
    trace: { ...TRACE, taskId: 'changed' },
    payload: 'hostResult',
    hostResult: { result: 'getConfig', getConfig: { value: { stringValue: 'x' } } },
  }), /changed trace context/);
  await rejected;
});

test('HostError preserves a nested host protocol error', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const request = host.call(TRACE, { commitDocuments: { operationId: 'one' } });
  const sent = await eventually(() => sender.messages[0]);
  const rejected = assert.rejects(request, (error) => {
    assert(error instanceof HostError);
    assert.equal(error.code, 'ERROR_CODE_REVISION_CONFLICT');
    assert.equal(error.retryable, true);
    assert.deepEqual(error.metadata, { path: '/one.md' });
    assert.equal(error.details[0].type_url, 'type.example/conflict');
    return true;
  });
  host.route({
    replyTo: sent.messageId.toString(),
    trace: TRACE,
    payload: 'hostResult',
    hostResult: {
      result: 'error',
      error: {
        code: 'ERROR_CODE_REVISION_CONFLICT',
        message: 'revision changed',
        retryable: true,
        metadata: { path: '/one.md' },
        details: [{ type_url: 'type.example/conflict', value: Buffer.from('detail') }],
      },
    },
  });
  await rejected;
});

test('host calls reject a response kind that differs from the request', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const request = host.call(TRACE, {
    readDocument: { path: { value: '/one.md' }, projection: 'DOCUMENT_PROJECTION_CONTENT' },
  });
  const sent = await eventually(() => sender.messages[0]);
  host.route({
    replyTo: sent.messageId.toString(),
    trace: TRACE,
    payload: 'hostResult',
    hostResult: { result: 'listDirectory', listDirectory: {} },
  });
  await assert.rejects(request, /readDocument received another response kind/);

  await assert.rejects(
    host.call(TRACE, { readDocument: null }),
    /readDocument request must be an object/,
  );
});

test('configuration calls enforce paths and active-session function handles in both directions', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  await assert.rejects(
    host.getConfig(TRACE, { segments: [{ key: 'one', index: '0' }] }),
    /exactly one kind/,
  );
  await assert.rejects(host.invokeConfigFunction(
    TRACE,
    { sessionId: 'another-session', functionId: 'function' },
    [],
  ), /another plugin session/);
  assert.equal(sender.messages.length, 0);

  const request = host.getConfig(TRACE);
  const sent = await eventually(() => sender.messages[0]);
  host.route({
    replyTo: sent.messageId.toString(),
    trace: TRACE,
    payload: 'hostResult',
    hostResult: {
      result: 'getConfig',
      getConfig: {
        value: {
          functionValue: { sessionId: 'another-session', functionId: 'function' },
        },
      },
    },
  });
  await assert.rejects(request, /another plugin session/);
});

test('host bounds pending calls and rejects every waiter on session close', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  const calls = Array.from({ length: 256 }, () => host.getConfig(TRACE));
  await assert.rejects(host.getConfig(TRACE), /too many host requests/);
  const settled = Promise.allSettled(calls);
  host.close(new Error('session closed'));
  const results = await settled;
  assert(results.every((result) => result.status === 'rejected'));
  assert(results.every((result) => result.reason.message === 'session closed'));
});

test('artifact transfer consumes an async iterable once and verifies it incrementally', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '8', 8);
  const artifact = descriptor('streamed payload');
  let pulls = 0;
  async function* chunks() {
    pulls += 1;
    yield Buffer.from('streamed');
    pulls += 1;
    yield Buffer.from(' payload');
  }

  const stored = host.storeArtifact(TRACE, JOB_ID, artifact, chunks(), { chunkCount: 2 });
  const start = await eventually(() => sender.messages.find((message) => message.artifactStart));
  assert.equal(pulls, 0);
  host.route(artifactReply(start, 'artifactAccepted', {
    artifactId: artifact.artifactId,
  }));
  await eventually(() => sender.messages.filter((message) => message.artifactChunk).length === 2);
  assert.equal(pulls, 2);
  const complete = await eventually(() => sender.messages.find((message) => message.artifactComplete));
  host.route(artifactReply(complete, 'artifactStored', { artifactId: artifact.artifactId }));
  assert.deepEqual(await stored, { artifactId: artifact.artifactId });
  assert.deepEqual(
    sender.messages.filter((message) => message.artifactChunk).map((message) =>
      message.artifactChunk.chunkIndex),
    [0, 1],
  );
});

test('artifact transfer supports a zero-byte artifact with no chunks', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '8', 8);
  const artifact = descriptor('');
  const stored = host.storeArtifact(TRACE, JOB_ID, artifact, []);
  const start = await eventually(() => sender.messages.find((message) => message.artifactStart));
  assert.equal(start.artifactStart.chunkCount, 0);
  host.route(artifactReply(start, 'artifactAccepted', { artifactId: artifact.artifactId }));
  const complete = await eventually(() => sender.messages.find((message) => message.artifactComplete));
  host.route(artifactReply(complete, 'artifactStored', { artifactId: artifact.artifactId }));
  await stored;
  assert.equal(sender.messages.some((message) => message.artifactChunk), false);
});

test('artifact cancellation interrupts a pending async iterator and sends no more chunks', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1', 8);
  const artifact = descriptor('ab');
  const gate = deferred();
  async function* chunks() {
    yield Buffer.from('a');
    await gate.promise;
    yield Buffer.from('b');
  }
  const abort = new AbortController();
  const stored = host.storeArtifact(TRACE, JOB_ID, artifact, chunks(), {
    chunkCount: 2,
    signal: abort.signal,
  });
  const start = await eventually(() => sender.messages.find((message) => message.artifactStart));
  host.route(artifactReply(start, 'artifactAccepted', { artifactId: artifact.artifactId }));
  await eventually(() => sender.messages.filter((message) => message.artifactChunk).length === 1);
  const rejected = assert.rejects(stored, /stop transfer/);
  abort.abort(new Error('stop transfer'));
  await rejected;
  assert.equal(sender.messages.filter((message) => message.artifactChunk).length, 1);
  gate.resolve();
});

test('non-array artifact streams require an explicit chunk count', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1024', 8);
  async function* chunks() { yield Buffer.from('x'); }
  await assert.rejects(
    host.storeArtifact(TRACE, JOB_ID, descriptor('x'), chunks()),
    /chunkCount is required/,
  );
  assert.equal(sender.messages.length, 0);
});

test('closing the host aborts an artifact blocked in its async source', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1', 8);
  const gate = deferred();
  async function* chunks() {
    await gate.promise;
    yield Buffer.from('x');
  }
  const stored = host.storeArtifact(TRACE, JOB_ID, descriptor('x'), chunks(), { chunkCount: 1 });
  const start = await eventually(() => sender.messages.find((message) => message.artifactStart));
  host.route(artifactReply(start, 'artifactAccepted', { artifactId: start.artifactStart.artifact.artifactId }));
  const rejected = assert.rejects(stored, /session closed/);
  host.close(new Error('session closed'));
  await rejected;
  gate.resolve();
});

test('a protocol error replying to an artifact chunk reaches that transfer', async () => {
  const sender = new RecordingSender();
  const host = new Host(sender, '1', 8);
  const gate = deferred();
  async function* chunks() {
    yield Buffer.from('a');
    await gate.promise;
    yield Buffer.from('b');
  }
  const stored = host.storeArtifact(TRACE, JOB_ID, descriptor('ab'), chunks(), { chunkCount: 2 });
  const start = await eventually(() => sender.messages.find((message) => message.artifactStart));
  host.route(artifactReply(start, 'artifactAccepted', { artifactId: start.artifactStart.artifact.artifactId }));
  const chunk = await eventually(() => sender.messages.find((message) => message.artifactChunk));
  const rejected = assert.rejects(stored, (error) => {
    assert(error instanceof HostError);
    assert.equal(error.code, 'ERROR_CODE_INVALID_ARGUMENT');
    return true;
  });
  host.route({
    replyTo: chunk.messageId.toString(),
    trace: chunk.trace,
    payload: 'protocolError',
    protocolError: {
      code: 'ERROR_CODE_INVALID_ARGUMENT',
      message: 'bad chunk',
      retryable: false,
    },
  });
  await rejected;
  gate.resolve();
});

const JOB_ID = '00000000-0000-4000-8000-000000000011';
const ARTIFACT_ID = '00000000-0000-4000-8000-000000000012';

function descriptor(contents) {
  const bytes = Buffer.from(contents);
  return {
    artifactId: { value: ARTIFACT_ID },
    fileName: 'result.txt',
    mediaType: 'text/plain',
    sizeBytes: String(bytes.length),
    sha256: createHash('sha256').update(bytes).digest(),
  };
}

function artifactReply(request, payload, value) {
  return {
    replyTo: request.messageId.toString(),
    trace: request.trace,
    payload,
    [payload]: value,
  };
}
