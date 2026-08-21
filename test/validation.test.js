import assert from 'node:assert/strict';
import test from 'node:test';
import { ActionResult, HostError, Plugin } from '../src/index.js';
import {
  validateArtifactChunkPlan,
  validateConfigValue,
  validateEndpoint,
  validatePluginId,
} from '../src/validation.js';

test('validates public plugin and action inputs at their owner', () => {
  assert.throws(() => new Plugin('invalid', '0.1.0'), /plugin ID/);
  assert.throws(() => new Plugin('dev.example.plugin', ''), /version/);
  const plugin = new Plugin('dev.example.plugin', '0.1.0');
  assert.throws(() => plugin.action('', '', () => new ActionResult()), /action name/);
  assert.throws(() => plugin.action('echo', '', undefined), /handler/);
  assert.equal(validatePluginId('dev.example.plugin'), 'dev.example.plugin');
});

test('accepts only explicit loopback HTTP endpoints', () => {
  assert.equal(validateEndpoint('http://localhost:1234'), 'localhost:1234');
  assert.equal(validateEndpoint('http://127.0.0.1:1234'), '127.0.0.1:1234');
  assert.equal(validateEndpoint('http://[::1]:1234'), '[::1]:1234');
  for (const endpoint of [
    'https://127.0.0.1:1234',
    'http://0.0.0.0:1234',
    'http://example.com:1234',
    'http://127.0.0.1',
    'http://user@127.0.0.1:1234',
    'not a URL',
  ]) {
    assert.throws(() => validateEndpoint(endpoint), /OLL_PLUGIN_ENDPOINT/);
  }
});

test('ActionResult rejects malformed and mutable-looking protocol values early', () => {
  assert.deepEqual(ActionResult.string('value').result, { stringValue: 'value' });
  assert.throws(() => ActionResult.string(1), /string/);
  assert.throws(() => new ActionResult({ numberValue: Number.NaN }), /finite/);
  assert.throws(() => new ActionResult({ stringValue: 'x', boolValue: true }), /exactly one/);
  assert.throws(() => new ActionResult({ functionValue: {
    sessionId: 'session',
    functionId: 'function',
  } }), /cannot contain/);
  const result = new ActionResult();
  assert(Object.isFrozen(result.artifacts));
});

test('ConfigValue recursion enforces protobuf domains and depth', () => {
  assert.doesNotThrow(() => validateConfigValue({
    mapValue: { entries: { nested: { listValue: { values: [{ integerValue: '42' }] } } } },
  }));
  assert.throws(() => validateConfigValue({ integerValue: '9223372036854775808' }), /64-bit/);
  assert.throws(() => validateConfigValue({
    timestampValue: { seconds: '253402300800', nanos: 0 },
  }), /Timestamp range/);

  let nested = { stringValue: 'leaf' };
  for (let depth = 0; depth < 34; depth += 1) nested = { listValue: { values: [nested] } };
  assert.throws(() => validateConfigValue(nested), /maximum configuration depth/);
});

test('artifact plans support empty files and reject impossible partitions', () => {
  assert.doesNotThrow(() => validateArtifactChunkPlan('0', 0, '1024'));
  assert.doesNotThrow(() => validateArtifactChunkPlan('3', 2, '2'));
  assert.throws(() => validateArtifactChunkPlan('0', 1, '1024'), /zero chunks/);
  assert.throws(() => validateArtifactChunkPlan('3', 1, '2'), /cannot represent/);
  assert.throws(() => validateArtifactChunkPlan('2', 3, '2'), /cannot represent/);
});

test('HostError preserves structured protocol diagnostics', () => {
  const detail = { type_url: 'type.example/detail', value: Buffer.from('detail') };
  const error = new HostError({
    code: 'ERROR_CODE_REVISION_CONFLICT',
    message: 'changed',
    retryable: true,
    metadata: { document: 'one' },
    details: [detail],
  });
  assert.equal(error.name, 'HostError');
  assert.equal(error.code, 'ERROR_CODE_REVISION_CONFLICT');
  assert.equal(error.retryable, true);
  assert.deepEqual(error.metadata, { document: 'one' });
  assert.deepEqual(error.details, [detail]);
  assert.throws(() => new HostError({ code: 'NOT_A_CODE' }), /code is invalid/);
  assert.throws(() => new HostError({ metadata: { count: 1 } }), /string values/);
});

test('Host is internal and cannot be accidentally constructed from the public API', async () => {
  const sdk = await import('../src/index.js');
  assert.equal('Host' in sdk, false);
});

test('an already-ended parent pipe exits cleanly and resets Plugin.run state', async () => {
  const stdin = {
    readableEnded: true,
    once() {},
    off() {},
    resume() {},
    pause() {},
  };
  const plugin = new Plugin('dev.example.plugin', '0.1.0');
  await plugin.run({ endpoint: 'http://127.0.0.1:1', stdin });
  await plugin.run({ endpoint: 'http://127.0.0.1:1', stdin });
  assert.doesNotThrow(() => plugin.action('after-run', '', () => new ActionResult()));
});
