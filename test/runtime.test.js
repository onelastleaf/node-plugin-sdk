import assert from 'node:assert/strict';
import test from 'node:test';
import { ActionResult, Host, Plugin } from '../src/index.js';
import { validateEndpoint } from '../src/runtime.js';

test('validates identity and results', () => {
  assert.throws(() => new Plugin('invalid', '0.1.0'));
  assert.deepEqual(ActionResult.string('value').result, { stringValue: 'value' });
});

test('rejects invalid artifact metadata before starting a transfer', async () => {
  const host = new Host(undefined, 1024);
  await assert.rejects(() => host.storeArtifact(
    { correlationId: 'test', callDepth: 0, causalDepth: 0 },
    '0f337c0c-51d6-44a9-a691-a31fce775ab1',
    {
      artifactId: { value: 'not-a-uuid' },
      fileName: 'result.txt',
      mediaType: 'text/plain',
      sizeBytes: 3,
      sha256: Buffer.alloc(32),
    },
    [Buffer.from('abc')],
  ), /descriptor/);
});

test('accepts IPv4 and IPv6 loopback endpoints only', () => {
  assert.equal(validateEndpoint('http://127.0.0.1:1234'), '127.0.0.1:1234');
  assert.equal(validateEndpoint('http://[::1]:1234'), '[::1]:1234');
  assert.throws(() => validateEndpoint('http://0.0.0.0:1234'));
});
