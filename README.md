# onelastleaf Node.js plugin SDK

The JavaScript runtime and TypeScript declarations for trusted onelastleaf
process plugins. Install it as `@onelastleaf/plugin-sdk`.

## Generated projects and installation layout

Invoking `oll plugin new` with `--language javascript` or
`--language typescript` only writes the project files, including `package.json`
and `oll.toml`. It does not run npm, clone a repository, contact the daemon, or
access the network. Dependency installation happens later, when
`oll plugin install --source`, `plugin update`, or reconciliation executes the
source recipe declared by the plugin. The official templates use `npm install`,
but a project may declare another package manager explicitly.

The generated manifests select this layout:

```toml
[source]
checkout = "install"
```

This is a publisher-owned choice made by the Node.js templates, not language
detection inside oll, and a user mask cannot override it. oll first uses an
internal temporary clone to resolve the plugin ID and manifest; that directory
is not exposed as a recipe placeholder. It then places the complete checkout in
a candidate `{install}` tree. Source steps run there, and oll renames the whole
tree once into its final UUID-named generation before atomically switching
`current`. Source steps and runtime argv may use `{install}` and `{mask_dir}`;
`{source}` and `{generation}` are deliberately not available for this checkout
mode.

The install tree must remain valid after that one rename. Normal project-local
dependency layouts produced by npm, Yarn, pnpm, or Bun are compatible with this
model; custom build tools that persist the candidate's absolute path are not.
If a plugin really needs an absolute final prefix, its publisher must select
`checkout = "generation"` and use `{generation}` instead.

The whole source checkout, including its `.git` directory, dependencies, and
build output, remains in the installed generation. Do not put secrets in the
repository, and account for those files when estimating disk use. Release-mode
installation ignores `source.checkout` and continues to require a relocatable
published artifact.
