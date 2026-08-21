import assert from 'node:assert/strict';
import test from 'node:test';
import { Sender } from '../src/sender.js';
import { TRACE } from './support.js';

test('ordered sender never overlaps concurrent gRPC writes', async () => {
  const writes = [];
  const callbacks = [];
  const stream = {
    write(envelope, callback) {
      writes.push(envelope);
      callbacks.push(callback);
    },
  };
  const sender = new Sender(stream);
  sender.setIdentity('session', 'instance');
  const first = sender.send(undefined, TRACE, { log: { message: 'first' } });
  const second = sender.send(undefined, TRACE, { log: { message: 'second' } });

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(writes.length, 1);
  assert.equal(writes[0].messageId, '1');
  assert.equal(writes[0].sessionId, 'session');
  callbacks.shift()(undefined);
  await first;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(writes.length, 2);
  assert.equal(writes[1].messageId, '2');
  callbacks.shift()(undefined);
  await second;
});

test('sender snapshots a payload when it enters the ordered queue', async () => {
  const writes = [];
  const callbacks = [];
  const sender = new Sender({
    write(envelope, callback) {
      writes.push(envelope);
      callbacks.push(callback);
    },
  });
  const first = sender.send(undefined, TRACE, { ready: {} });
  const payload = { log: { message: 'before', fields: { key: { stringValue: 'one' } } } };
  const second = sender.send(undefined, TRACE, payload);
  payload.log.message = 'after';
  payload.log.fields.key.stringValue = 'two';

  await new Promise((resolve) => setImmediate(resolve));
  callbacks.shift()(undefined);
  await first;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(writes[1].log.message, 'before');
  assert.equal(writes[1].log.fields.key.stringValue, 'one');
  callbacks.shift()(undefined);
  await second;
});

test('one failed write rejects queued followers without writing out of order', async () => {
  const callbacks = [];
  let writes = 0;
  const sender = new Sender({
    write(_envelope, callback) {
      writes += 1;
      callbacks.push(callback);
    },
  });
  const first = sender.send(undefined, TRACE, { ready: {} });
  const second = sender.send(undefined, TRACE, { ready: {} });
  const settled = Promise.allSettled([first, second]);
  await new Promise((resolve) => setImmediate(resolve));
  callbacks[0](new Error('stream failed'));

  const results = await settled;
  assert.deepEqual(results.map((result) => result.status), ['rejected', 'rejected']);
  assert.equal(writes, 1);
});

test('sender catches synchronous stream failures as Promise rejections', async () => {
  const sender = new Sender({
    write() { throw new Error('serialization failed'); },
  });
  await assert.rejects(sender.send(undefined, TRACE, { ready: {} }), /serialization failed/);
});

test('sender applies explicit bounded backpressure', async () => {
  const sender = new Sender({
    write(_envelope, callback) { queueMicrotask(() => callback(undefined)); },
  });
  const queued = Array.from({ length: 256 }, () =>
    sender.send(undefined, TRACE, { ready: {} }));
  assert.throws(() => sender.send(undefined, TRACE, { ready: {} }), /queue is full/);
  await Promise.all(queued);
});

test('sender close rejects future writes at the owner boundary', () => {
  const sender = new Sender({ write() {} });
  const reason = new Error('closed for test');
  sender.close(reason);
  assert.throws(() => sender.send(undefined, TRACE, { ready: {} }), /closed for test/);
});
