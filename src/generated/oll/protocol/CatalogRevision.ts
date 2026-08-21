// Original file: proto/oll/common.proto


export interface CatalogRevision {
  /**
   * An opaque token representing the observed catalog state of one
   * CatalogNodeId. This intentionally does not expose Loro's frontier or
   * version-vector API.
   */
  'token'?: (Buffer | Uint8Array | string);
}

export interface CatalogRevision__Output {
  /**
   * An opaque token representing the observed catalog state of one
   * CatalogNodeId. This intentionally does not expose Loro's frontier or
   * version-vector API.
   */
  'token'?: (Buffer);
}
