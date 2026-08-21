import type { Long } from '@grpc/proto-loader';
import type { Any__Output } from './generated/google/protobuf/Any.js';
import type {
  CommitDocumentsRequest,
} from './generated/oll/protocol/CommitDocumentsRequest.js';
import type {
  CommitDocumentsResponse__Output,
} from './generated/oll/protocol/CommitDocumentsResponse.js';
import type { ConfigValue__Output } from './generated/oll/protocol/ConfigValue.js';
import type {
  ConfigFunctionRef__Output,
} from './generated/oll/protocol/ConfigFunctionRef.js';
import type { ErrorCode__Output } from './generated/oll/protocol/ErrorCode.js';
import type {
  GetConfigResponse__Output,
} from './generated/oll/protocol/GetConfigResponse.js';
import type {
  GetDirectoryTreeRequest,
} from './generated/oll/protocol/GetDirectoryTreeRequest.js';
import type {
  GetDirectoryTreeResponse__Output,
} from './generated/oll/protocol/GetDirectoryTreeResponse.js';
import type {
  InvokeConfigFunctionResponse__Output,
} from './generated/oll/protocol/InvokeConfigFunctionResponse.js';
import type { ListDirectoryRequest } from './generated/oll/protocol/ListDirectoryRequest.js';
import type {
  ListDirectoryResponse__Output,
} from './generated/oll/protocol/ListDirectoryResponse.js';
import type { LogLevel__Output } from './generated/oll/protocol/LogLevel.js';
import type { ReadCrdtRequest } from './generated/oll/protocol/ReadCrdtRequest.js';
import type { ReadCrdtResponse__Output } from './generated/oll/protocol/ReadCrdtResponse.js';
import type {
  ReadDocumentRequest,
} from './generated/oll/protocol/ReadDocumentRequest.js';
import type {
  ReadDocumentResponse__Output,
} from './generated/oll/protocol/ReadDocumentResponse.js';

export type Integer64 = number | string | Long;

export type Timestamp = {
  readonly seconds?: Integer64;
  readonly nanos?: number;
};

export type Duration = {
  readonly seconds?: Integer64;
  readonly nanos?: number;
};

export type ConfigFunctionRef = {
  readonly sessionId: string;
  readonly functionId: string;
};

type ConfigKinds = {
  readonly nullValue: 'NULL_VALUE' | 0;
  readonly boolValue: boolean;
  readonly integerValue: Integer64;
  readonly numberValue: number;
  readonly stringValue: string;
  readonly bytesValue: Uint8Array;
  readonly listValue: { readonly values?: readonly ConfigValue[] };
  readonly mapValue: { readonly entries?: Readonly<Record<string, ConfigValue>> };
  readonly functionValue: ConfigFunctionRef;
  readonly timestampValue: Timestamp;
  readonly durationValue: Duration;
};

type ExactlyOne<T extends Record<string, unknown>> = {
  [Key in keyof T]: Pick<T, Key> & Partial<Record<Exclude<keyof T, Key>, never>>;
}[keyof T];

export type ConfigValue = ExactlyOne<ConfigKinds>;
export type DecodedConfigValue = ConfigValue__Output;

export type ConfigPathSegment =
  | { readonly key: string; readonly index?: never }
  | { readonly key?: never; readonly index: Integer64 };

export type ConfigPath = { readonly segments?: readonly ConfigPathSegment[] };

export type TraceContext = {
  readonly correlationId: string;
  readonly parentCallId?: Integer64;
  readonly callDepth: number;
  readonly causalDepth: number;
  readonly taskId?: string;
  readonly taskGroupId?: string;
};

export type PluginArtifactId = { readonly value: string };

export type ArtifactDescriptor = {
  readonly artifactId: PluginArtifactId;
  readonly fileName: string;
  readonly mediaType: string;
  readonly sizeBytes: Integer64;
  readonly sha256: Uint8Array;
};

export type ArtifactStored = { readonly artifactId: PluginArtifactId };

export type ErrorCode = ErrorCode__Output;
export type LogLevel = Exclude<LogLevel__Output, 'LOG_LEVEL_UNSPECIFIED'>;

export type HostErrorData = {
  code?: ErrorCode;
  message?: string;
  retryable?: boolean;
  metadata?: Readonly<Record<string, string>>;
  details?: readonly Any__Output[];
};

export class HostError extends Error {
  constructor(error?: HostErrorData, options?: ErrorOptions);
  readonly code: ErrorCode;
  readonly retryable: boolean;
  readonly metadata: Readonly<Record<string, string>>;
  readonly details: readonly Any__Output[];
}

type HostCallDefinitions = {
  readDocument: {
    request: ReadDocumentRequest;
    response: ReadDocumentResponse__Output;
  };
  listDirectory: {
    request: ListDirectoryRequest;
    response: ListDirectoryResponse__Output;
  };
  getDirectoryTree: {
    request: GetDirectoryTreeRequest;
    response: GetDirectoryTreeResponse__Output;
  };
  readCrdt: {
    request: ReadCrdtRequest;
    response: ReadCrdtResponse__Output;
  };
  commitDocuments: {
    request: CommitDocumentsRequest;
    response: CommitDocumentsResponse__Output;
  };
};

export type HostCallName = keyof HostCallDefinitions;

export type HostCall<Name extends HostCallName = HostCallName> =
  Name extends HostCallName
    ? { [Key in Name]: HostCallDefinitions[Name]['request'] }
    : never;

export type HostCallResult<Name extends HostCallName> =
  { readonly result: Name }
  & { readonly [Key in Name]: HostCallDefinitions[Name]['response'] };

export type ArtifactChunkStream = Iterable<Uint8Array> | AsyncIterable<Uint8Array>;

export class ActionResult {
  constructor(result?: ConfigValue, artifacts?: readonly ArtifactDescriptor[]);
  readonly result?: ConfigValue;
  readonly artifacts: readonly ArtifactDescriptor[];
  static string(value: string): ActionResult;
}

export type ActionContext = {
  readonly jobId: string;
  readonly deadline?: Timestamp;
  readonly trace: Readonly<TraceContext>;
  readonly signal: AbortSignal;
  hostCall(call: HostCall<'readDocument'>): Promise<HostCallResult<'readDocument'>>;
  hostCall(call: HostCall<'listDirectory'>): Promise<HostCallResult<'listDirectory'>>;
  hostCall(call: HostCall<'getDirectoryTree'>): Promise<HostCallResult<'getDirectoryTree'>>;
  hostCall(call: HostCall<'readCrdt'>): Promise<HostCallResult<'readCrdt'>>;
  hostCall(call: HostCall<'commitDocuments'>): Promise<HostCallResult<'commitDocuments'>>;
  getConfig(path?: ConfigPath): Promise<GetConfigResponse__Output>;
  invokeConfigFunction(
    functionRef: ConfigFunctionRef | ConfigFunctionRef__Output,
    arguments_: readonly ConfigValue[],
  ): Promise<InvokeConfigFunctionResponse__Output>;
  log(
    level: LogLevel,
    target: string,
    message: string,
    fields?: Readonly<Record<string, ConfigValue>>,
  ): Promise<void>;
  storeArtifact(
    artifact: ArtifactDescriptor,
    chunks: readonly Uint8Array[],
  ): Promise<ArtifactStored>;
  storeArtifact(
    artifact: ArtifactDescriptor,
    chunks: ArtifactChunkStream,
    options: { chunkCount: number },
  ): Promise<ArtifactStored>;
};

export type ActionHandler = (
  context: ActionContext,
  arguments_: readonly string[],
) => ActionResult | PromiseLike<ActionResult>;

export class Plugin {
  constructor(id: string, version: string);
  action(name: string, description: string, handler: ActionHandler): this;
  run(options?: { endpoint?: string; stdin?: NodeJS.ReadableStream }): Promise<void>;
}
