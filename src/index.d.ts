export type TraceContext = {
  correlationId: string;
  parentCallId?: string;
  callDepth: number;
  causalDepth: number;
  taskId?: string;
  taskGroupId?: string;
};

export class ActionResult {
  constructor(result?: unknown, artifacts?: unknown[]);
  result?: unknown;
  artifacts: unknown[];
  static string(value: string): ActionResult;
}

export type ActionContext = {
  jobId: string;
  deadline?: unknown;
  trace: TraceContext;
  signal: AbortSignal;
  host: Host;
  hostCall(call: unknown): Promise<unknown>;
  getConfig(path?: unknown): Promise<unknown>;
  invokeConfigFunction(functionRef: unknown, arguments_: unknown[]): Promise<unknown>;
  log(level: string | number, target: string, message: string, fields?: Record<string, unknown>): Promise<void>;
  storeArtifact(artifact: unknown, chunks: Uint8Array[]): Promise<unknown>;
};

export type ActionHandler = (
  context: ActionContext,
  arguments_: string[],
) => ActionResult | Promise<ActionResult>;

export class Host {
  readonly maximumArtifactChunkBytes: bigint;
  readonly maximumCallDepth: number;
  call(trace: TraceContext, call: unknown, options?: { signal?: AbortSignal }): Promise<unknown>;
  getConfig(trace: TraceContext, path?: unknown, options?: { signal?: AbortSignal }): Promise<unknown>;
  invokeConfigFunction(trace: TraceContext, functionRef: unknown, arguments_: unknown[], options?: { signal?: AbortSignal }): Promise<unknown>;
  log(trace: TraceContext, level: string | number, target: string, message: string, fields?: Record<string, unknown>): Promise<void>;
  storeArtifact(trace: TraceContext, jobId: string, artifact: unknown, chunks: Uint8Array[], options?: { signal?: AbortSignal }): Promise<unknown>;
}

export class Plugin {
  constructor(id: string, version: string);
  action(name: string, description: string, handler: ActionHandler): this;
  run(options?: { endpoint?: string; stdin?: NodeJS.ReadableStream }): Promise<void>;
}
