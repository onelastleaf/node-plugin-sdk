// Original file: proto/oll/document.proto

export const DocumentProjection = {
  DOCUMENT_PROJECTION_UNSPECIFIED: 'DOCUMENT_PROJECTION_UNSPECIFIED',
  DOCUMENT_PROJECTION_CONTENT: 'DOCUMENT_PROJECTION_CONTENT',
  DOCUMENT_PROJECTION_CRDT: 'DOCUMENT_PROJECTION_CRDT',
} as const;

export type DocumentProjection =
  | 'DOCUMENT_PROJECTION_UNSPECIFIED'
  | 0
  | 'DOCUMENT_PROJECTION_CONTENT'
  | 1
  | 'DOCUMENT_PROJECTION_CRDT'
  | 2

export type DocumentProjection__Output = typeof DocumentProjection[keyof typeof DocumentProjection]
