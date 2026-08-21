import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { firstDifference } from '../scripts/generate-protocol-types.mjs';

test('generated declaration checks ignore checkout line endings only', async (context) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'oll-node-generated-check-'));
  context.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const expected = path.join(temporaryRoot, 'expected');
  const actual = path.join(temporaryRoot, 'actual');
  await Promise.all([
    mkdir(path.join(expected, 'nested'), { recursive: true }),
    mkdir(path.join(actual, 'nested'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(path.join(expected, 'nested/declaration.ts'), 'first\nsecond\n'),
    writeFile(path.join(actual, 'nested/declaration.ts'), 'first\r\nsecond\r\n'),
  ]);

  assert.equal(await firstDifference(expected, actual), undefined);

  await writeFile(path.join(actual, 'nested/declaration.ts'), 'first\r\nchanged\r\n');
  assert.equal(await firstDifference(expected, actual), 'nested/declaration.ts differs');
});
