// Original file: proto/oll/common.proto


export interface DocumentRevision {
  /**
   * An opaque token representing the observed content and abstract CRDT state
   * of one DocumentId. This intentionally does not expose Loro's frontier or
   * version-vector API.
   */
  'token'?: (Buffer | Uint8Array | string);
}

export interface DocumentRevision__Output {
  /**
   * An opaque token representing the observed content and abstract CRDT state
   * of one DocumentId. This intentionally does not expose Loro's frontier or
   * version-vector API.
   */
  'token'?: (Buffer);
}
