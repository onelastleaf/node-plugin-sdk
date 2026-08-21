import { cp, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'src/generated');
const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'oll-node-protocol-types-'));
const generated = path.join(temporaryRoot, 'generated');
const generator = path.join(
  root,
  'node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js',
);

try {
  const result = spawnSync(process.execPath, [
    generator,
    '--longs=String',
    '--enums=String',
    '--oneofs',
    '--includeComments',
    '--grpcLib=@grpc/grpc-js',
    '--includeDirs=proto',
    '--targetFileExtension=.ts',
    '--importFileExtension=.js',
    `--outDir=${generated}`,
    'oll/plugin.proto',
  ], { cwd: root, encoding: 'utf8' });
  if (result.error) {
    throw result.error;
  } else if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exitCode = result.status ?? 1;
  } else {
    await writeGeneratedIndex(generated);
    if (process.argv.includes('--check')) {
      const difference = await firstDifference(generated, destination);
      if (difference) {
        console.error(`generated protocol declarations are stale: ${difference}`);
        process.exitCode = 1;
      }
    } else {
      await rm(destination, { recursive: true, force: true });
      await cp(generated, destination, { recursive: true });
    }
  }
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

async function writeGeneratedIndex(directory) {
  const files = (await listFiles(directory))
    .filter((file) => file.endsWith('.ts'))
    .sort();
  const exports = files.map((file) => {
    const modulePath = `./${file.slice(0, -'.ts'.length)}.js`;
    return `export type * from '${modulePath}';`;
  });
  await writeFile(
    path.join(directory, 'index.d.ts'),
    `// Generated from the canonical protobuf copies. Do not edit.\n${exports.join('\n')}\n`,
  );
}

async function firstDifference(expectedRoot, actualRoot) {
  let expected;
  let actual;
  try {
    [expected, actual] = await Promise.all([listFiles(expectedRoot), listFiles(actualRoot)]);
  } catch (error) {
    if (error.code === 'ENOENT') return 'src/generated is missing';
    throw error;
  }
  const expectedNames = new Set(expected);
  const actualNames = new Set(actual);
  const names = new Set([...expectedNames, ...actualNames]);
  for (const name of [...names].sort()) {
    if (!expectedNames.has(name)) return `${name} should be removed`;
    if (!actualNames.has(name)) return `${name} is missing`;
    const [left, right] = await Promise.all([
      readFile(path.join(expectedRoot, name)),
      readFile(path.join(actualRoot, name)),
    ]);
    if (!left.equals(right)) return `${name} differs`;
  }
  return undefined;
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(path.join(directory, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(directory, relative));
    else if (entry.isFile()) files.push(relative.split(path.sep).join('/'));
  }
  return files;
}
