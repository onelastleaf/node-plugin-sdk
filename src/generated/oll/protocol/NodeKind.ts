// Original file: proto/oll/document.proto

export const NodeKind = {
  NODE_KIND_UNSPECIFIED: 'NODE_KIND_UNSPECIFIED',
  NODE_KIND_DOCUMENT: 'NODE_KIND_DOCUMENT',
  NODE_KIND_DIRECTORY: 'NODE_KIND_DIRECTORY',
  NODE_KIND_BINARY: 'NODE_KIND_BINARY',
} as const;

export type NodeKind =
  | 'NODE_KIND_UNSPECIFIED'
  | 0
  | 'NODE_KIND_DOCUMENT'
  | 1
  | 'NODE_KIND_DIRECTORY'
  | 2
  | 'NODE_KIND_BINARY'
  | 3

export type NodeKind__Output = typeof NodeKind[keyof typeof NodeKind]
