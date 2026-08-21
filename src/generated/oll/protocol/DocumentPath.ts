// Original file: proto/oll/document.proto


/**
 * Paths are absolute, slash-separated, UTF-8 paths in the replica namespace.
 * They never contain '.', '..', an empty segment, or a trailing slash (except
 * for the root path "/").
 */
export interface DocumentPath {
  'value'?: (string);
}

/**
 * Paths are absolute, slash-separated, UTF-8 paths in the replica namespace.
 * They never contain '.', '..', an empty segment, or a trailing slash (except
 * for the root path "/").
 */
export interface DocumentPath__Output {
  'value'?: (string);
}
