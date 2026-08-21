# onelastleaf Node.js plugin SDK

Build trusted onelastleaf process plugins in JavaScript or TypeScript. Both
languages use the same `@onelastleaf/plugin-sdk` package and the same Node.js
runtime; TypeScript support comes from the declarations shipped with the
package.

If you just want to see an action run, start with [Create a plugin with
oll](#create-a-plugin-with-oll). The rest of this README explains what the
generated files do and how to use npm, Yarn, pnpm, or Bun without breaking the
install recipe.

## Requirements

- Node.js 20 or newer for the supported runtime;
- a running oll daemon when you are ready to install and call the plugin;
- Git and a remote repository that the oll daemon can reach;
- Node.js and one package manager available in the daemon user's `PATH`.

The generated projects use npm by default. npm, Yarn, pnpm, and Bun can all
install the dependencies; only Node.js is currently a release-tested runtime.
Bun-as-a-runtime is discussed separately below.

The SDK is published through the npm registry:

```sh
npm install @onelastleaf/plugin-sdk
# or: yarn add @onelastleaf/plugin-sdk
# or: pnpm add @onelastleaf/plugin-sdk
# or: bun add @onelastleaf/plugin-sdk
```

Projects created by `oll plugin new` already declare the matching SDK version,
so their normal package-manager install fetches it from the configured registry.

## Work on this SDK checkout

There is no compile step for the SDK itself. Its implementation is native ESM,
its TypeScript declarations live in `src/index.d.ts`, and the protocol files are
loaded at runtime.

```sh
npm ci
npm test
npm pack --dry-run
```

`npm test` runs the Node.js regression tests, statically checks the runtime
JavaScript, compiles the public TypeScript examples in strict mode, and checks
that generated declarations still match the checked-in `.proto` files. After
intentionally syncing a protocol change, run `npm run generate:types`. The
`npm pack --dry-run` command shows the exact files that would go into
`@onelastleaf/plugin-sdk` without publishing anything.

## Create a plugin with oll

The shortest path is to let oll create the project. The destination must not
already exist.

### JavaScript

```sh
oll plugin new ./hello-node \
  --language javascript \
  --id dev.example.hello-node \
  --name hello-node

cd hello-node
npm install
npm test
```

JavaScript runs directly from `src/index.js`; there is nothing to compile.

### TypeScript

```sh
oll plugin new ./hello-node-ts \
  --language typescript \
  --id dev.example.hello-node-ts \
  --name hello-node-ts

cd hello-node-ts
npm install
npm test
npm run build
```

TypeScript compiles `src/**/*.ts` to `dist/**/*.js`. The generated `prepare`
script also builds during `npm install`, but running `npm run build` yourself is
a useful, explicit check before committing.

`oll plugin new` only writes files. It deliberately does not install packages,
initialize Git, contact the daemon, or use the network. The generated
`package.json` pins the SDK version for reproducible builds, and the generated
`oll.toml` tells oll how to install and launch the project.

## Register an action

The JavaScript and TypeScript entry points have the same shape:

```js
import { ActionResult, Plugin } from '@onelastleaf/plugin-sdk';

await new Plugin('dev.example.hello-node', '0.1.0')
  .action('echo', 'Return the supplied arguments', async (context, arguments_) => {
    if (context.signal.aborted) return new ActionResult();
    await context.log('LOG_LEVEL_INFO', 'hello-node', 'echo was called');
    return ActionResult.string(arguments_.join(' '));
  })
  .run();
```

An action receives an `ActionContext` and the ordered string arguments from
`oll plugin call`. Useful context members include:

- `signal`, which is aborted after oll sends a cancellation for a user request
  or deadline;
- `getConfig(...)` and `invokeConfigFunction(...)` for the plugin's permitted
  live configuration;
- `hostCall(...)` for permitted host capabilities;
- `log(...)` for structured plugin logging;
- `storeArtifact(...)` for publishing an artifact through oll.

Return an `ActionResult`, or throw an error to fail the job. A plugin may serve
more than one job at a time, so action handlers should not rely on mutable
process-wide state unless they synchronize it themselves.

Cancellation is cooperative. Stop new work when `signal` aborts and let the
handler promise settle. The SDK keeps reading heartbeats and other session
messages while it waits, but it does not acknowledge cancellation until the
handler has actually stopped. oll owns deadline enforcement and sends the same
job-scoped cancellation request for a timeout; the SDK does not run a competing
local timer.

The context deliberately does not expose a raw transport or a constructible
`Host`. Its methods attach the negotiated trace, depth, job, and cancellation
state, so a call cannot accidentally escape its action scope.

### TypeScript protocol types

The main entry point exports strict action, configuration, artifact, trace, and
host-call types. The complete generated protobuf input/output types live at the
type-only `protocol-types` entry point:

```ts
import { ActionResult, Plugin } from '@onelastleaf/plugin-sdk';
import type { ReadDocumentRequest } from '@onelastleaf/plugin-sdk/protocol-types';

const read: ReadDocumentRequest = {
  path: { value: '/notes/today.md' },
  projection: 'DOCUMENT_PROJECTION_CONTENT',
};

await new Plugin('dev.example.typed', '0.1.0')
  .action('read', 'Read one document', async (context) => {
    const response = await context.hostCall({ readDocument: read });
    return ActionResult.string(response.readDocument.document?.content ?? '');
  })
  .run();
```

Host rejections use `HostError` instead of losing protobuf diagnostics in a
plain `Error`. Its `code`, `retryable`, `metadata`, and `details` fields remain
available for explicit retry or revision-conflict handling.

### Stream an artifact

An array of chunks needs no extra option. A general iterable or async iterable
also supplies its declared protobuf chunk count so the SDK can validate the
plan before oll creates staging state:

```js
await context.storeArtifact(descriptor, [header, body]);

await context.storeArtifact(descriptor, chunkSource(), {
  chunkCount: expectedChunkCount,
});
```

The SDK pulls and hashes one chunk at a time, checks cancellation between
chunks, and verifies the declared size and SHA-256 before completing the
transfer. It does not retain or make multiple passes over the whole artifact.

## Install the plugin into oll

oll installs plugins from Git remotes, not from the working directory. Commit
the generated project, push it somewhere the daemon can reach, and then install
it in source mode:

```sh
git init
git branch -M main
git add .
git commit -m "Add hello-node plugin"
git remote add origin git@github.com:example/hello-node.git
git push -u origin main

# Start an initialized daemon if it is not already running.
oll start
oll status

oll plugin install git@github.com:example/hello-node.git --source
oll plugin start dev.example.hello-node
oll plugin call dev.example.hello-node echo -- hello from node
```

Installation leaves a new plugin stopped. `plugin start` records the desired
state and asks the daemon to launch it. `plugin call` prints a job ID after the
plugin accepts the job; use that ID to inspect the eventual result:

```sh
oll job info <job-id>
oll plugin info dev.example.hello-node
oll plugin log dev.example.hello-node
```

After pushing a new commit, publish a new installed generation with:

```sh
oll plugin update dev.example.hello-node
oll plugin restart dev.example.hello-node
```

An update does not restart a running process automatically. Keeping those two
operations separate lets you choose when the new generation starts.

## Choose a package manager

The package manager has two jobs: create a lockfile while you are developing,
then reproduce that dependency tree when oll builds the remote checkout. Keep
one lockfile, commit it, and make the commands in `oll.toml` match it.

The generated template starts with `npm install` so it also works before a
lockfile exists. Once a lockfile is committed, a frozen install is a better
deployment recipe:

| Tool | Commit | Source step in `oll.toml` |
| --- | --- | --- |
| npm | `package-lock.json` | `["npm", "ci"]` |
| Yarn 1 (Classic) | `yarn.lock` | `["yarn", "install", "--frozen-lockfile", "--non-interactive"]` |
| Yarn 2+ (Modern) | `yarn.lock`, `.yarnrc.yml`, and any project-local Yarn files it references | `["yarn", "install", "--immutable"]` |
| pnpm | `pnpm-lock.yaml` | `["pnpm", "install", "--frozen-lockfile"]` |
| Bun | `bun.lock` | `["bun", "install", "--frozen-lockfile"]` |

For example, an npm-based JavaScript plugin can use:

```toml
[source]
checkout = "install"
steps = [
  ["npm", "ci"],
]

[source.dependencies]
"npm" = "Install Node.js with npm and ensure npm is in PATH."

[runtime]
argv = ["node", "{install}/src/index.js"]
```

For a TypeScript project that stays on npm, the generated `prepare` script runs
`npm run build` during `npm ci`, so no second source step is required.

When switching a TypeScript project away from npm, remove the generated
`"prepare": "npm run build"` entry from `package.json`, then add an explicit
build step after the install. This avoids a hidden call back to npm and works
consistently across package managers:

```toml
steps = [
  ["pnpm", "install", "--frozen-lockfile"],
  ["pnpm", "run", "build"],
]
```

Replace `[source.dependencies]` with both the package manager used during the
build and the Node.js runtime used after installation:

```toml
[source.dependencies]
"pnpm" = "Install pnpm and ensure pnpm is in PATH."
"node" = "Install Node.js 20 or newer and ensure node is in PATH."
```

The runtime remains:

```toml
[runtime]
argv = ["node", "{install}/dist/index.js"]
```

Apply the same pattern with `yarn run build` or `bun run build`, and list both
that tool and `node` under `[source.dependencies]`. Recipe entries are argv
arrays, not shell strings, so pipes, redirects, environment expansion, and
`&&` do not work there.

### Yarn Modern and Plug'n'Play

The simplest Yarn Modern setup keeps the generated Node.js runtime command and
uses a regular `node_modules` tree. Add this to `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

If you intentionally use Yarn Plug'n'Play, plain `node` does not load Yarn's PnP
resolver. Keep the Yarn project files in Git and launch through Yarn instead:

```toml
[runtime]
argv = ["yarn", "node", "{install}/src/index.js"] # JavaScript
# argv = ["yarn", "node", "{install}/dist/index.js"] # TypeScript
```

In that case Yarn is both an install-time and runtime dependency, so it must be
available to the daemon user whenever the plugin starts.

### Bun as package manager or runtime

Using `bun install` with the normal `node` runtime is supported by the project
layout: commit `bun.lock`, use the frozen source step from the table, and leave
`runtime.argv` pointing at Node.js.

Bun can also execute many Node.js applications, but Bun itself is not currently
a release-tested runtime for this SDK. Changing the runtime to
`["bun", "{install}/src/index.js"]` (or `dist/index.js`) is therefore an
experimental choice that should pass the full oll plugin conformance suite
before production use. The package's declared runtime contract remains
Node.js 20 or newer.

## Protocol evolution

This SDK follows the canonical protobuf wire contract. It never computes,
embeds, publishes, or compares a schema hash or fingerprint. Descriptor-wide
hashes change for compatible additions and unrelated services, so they reject
valid peers. Protocol changes instead preserve field numbers and wire types,
give additions safe absent semantics, and tolerate unknown fields. Exact SDK
pins provide reproducible builds; they are not protobuf API versioning.

The protocol also has no fixed encoded `PluginEnvelope` size. This SDK sets both
grpc-js message limits to unlimited instead of retaining its smaller receive
default. Artifact data remains bounded by the per-chunk limit from `HostHello`
and uses the streaming transfer above.

## How the plugin process fits into oll

You normally should not run `node src/index.js` or `node dist/index.js`
directly. There is no useful standalone mode:

1. oll binds an ephemeral loopback TCP gRPC server;
2. oll starts the configured runtime and sets `OLL_PLUGIN_ENDPOINT`;
3. the SDK connects to that endpoint and completes the protocol handshake;
4. oll sends jobs and cancellation requests over the stream;
5. stdin acts as a parent-liveness pipe, so EOF makes the SDK exit;
6. stdout and stderr are captured in the per-plugin log.

The plugin does not host a server, choose a port, or read configuration from an
injected file. Configuration and host capabilities are requested through the
`ActionContext` methods while a job is running.

## Generated installation layout

The JavaScript and TypeScript templates deliberately generate:

```toml
[source]
checkout = "install"
```

oll first uses an internal temporary clone to resolve the plugin ID and
manifest. It then places the complete checkout in a candidate `{install}` tree,
runs the source steps there, renames that whole tree once into its final
UUID-named generation, and atomically switches `current`.

That is why normal project-local layouts from npm, Yarn, pnpm, and Bun work, and
why build tools must not bake the candidate's absolute path into their output.
With `checkout = "install"`, source steps and runtime argv may use `{install}`
and `{mask_dir}`; `{source}` and `{generation}` are not available. A plugin that
truly needs an absolute final prefix must deliberately choose
`checkout = "generation"` and use `{generation}` instead.

The installed generation retains the whole checkout: `.git`, dependencies, and
build output. Do not commit secrets, and remember that all of those files count
toward disk use. Release-mode installation ignores `source.checkout` and still
requires a relocatable published artifact.
