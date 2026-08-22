import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const EXPECTED_LICENSE = 'GPL-3.0-or-later';
const EXPECTED_NOTICE =
  '@onelastleaf/plugin-sdk - Node.js SDK for onelastleaf process plugins';

test('package metadata and notice declare GPL 3.0 or later', async () => {
  const [packageSource, lockSource, license] = await Promise.all([
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
    readFile(new URL('../package-lock.json', import.meta.url), 'utf8'),
    readFile(new URL('../LICENSE', import.meta.url), 'utf8'),
  ]);
  const packageManifest = JSON.parse(packageSource);
  const lockfile = JSON.parse(lockSource);

  assert.equal(packageManifest.license, EXPECTED_LICENSE);
  assert.equal(lockfile.packages[''].license, EXPECTED_LICENSE);
  assert.match(license, new RegExp(`^ {4}${EXPECTED_NOTICE}$`, 'm'));
  assert.doesNotMatch(license, /nvim-config/);
  assert.match(
    license,
    /either version 3 of the License, or\s+\(at your option\) any later version/,
  );
});
