import {
  ActionResult,
  HostError,
  Plugin,
  type ArtifactDescriptor,
  type ConfigValue,
} from '../../src/index.js';
import type {
  CommitDocumentsRequest,
  ReadDocumentRequest,
} from '@onelastleaf/plugin-sdk/protocol-types';

const read: ReadDocumentRequest = {
  path: { value: '/typed.md' },
  projection: 'DOCUMENT_PROJECTION_CONTENT',
};
const commit: CommitDocumentsRequest = {
  operationId: 'typed-operation',
  mutations: [{ createDirectory: { path: { value: '/typed' } } }],
};
void commit;

const bytes = new Uint8Array([1, 2, 3]);
const artifact: ArtifactDescriptor = {
  artifactId: { value: '00000000-0000-4000-8000-000000000001' },
  fileName: 'typed.bin',
  mediaType: 'application/octet-stream',
  sizeBytes: bytes.byteLength,
  sha256: new Uint8Array(32),
};

new Plugin('dev.example.typed', '0.1.0').action(
  'typed',
  'exercise declarations',
  async (context, arguments_) => {
    const response = await context.hostCall({ readDocument: read });
    const content: string | undefined = response.readDocument.document?.content;
    void content;

    const configured = await context.getConfig({ segments: [{ key: 'handler' }] });
    const functionRef = configured.value?.functionValue;
    if (functionRef) {
      await context.invokeConfigFunction(functionRef, [{ stringValue: arguments_[0] ?? '' }]);
    }
    await context.log('LOG_LEVEL_INFO', 'typed', 'called', {
      count: { integerValue: arguments_.length },
    });
    await context.storeArtifact(artifact, [bytes]);

    async function* stream(): AsyncGenerator<Uint8Array> { yield bytes; }
    await context.storeArtifact(artifact, stream(), { chunkCount: 1 });

    // @ts-expect-error Host transport internals are intentionally not public.
    void context.host;
    // @ts-expect-error Async streams need an explicit protobuf chunk count.
    await context.storeArtifact(artifact, stream());
    // @ts-expect-error Unspecified is not an emitted log severity.
    await context.log('LOG_LEVEL_UNSPECIFIED', 'typed', 'bad');
    return ActionResult.string(arguments_.join(' '));
  },
);

const nested: ConfigValue = {
  mapValue: { entries: { values: { listValue: { values: [{ boolValue: true }] } } } },
};
void new ActionResult(nested, [artifact]);

// @ts-expect-error A ConfigValue has exactly one active kind.
const invalidValue: ConfigValue = { stringValue: 'x', boolValue: true };
void invalidValue;

const protocolError = new HostError({
  code: 'ERROR_CODE_NOT_FOUND',
  message: 'missing',
  retryable: false,
  metadata: { path: '/typed.md' },
});
const code: string = protocolError.code;
void code;

// @ts-expect-error Host is an internal state-machine owner, not a public constructor.
const loadHost = async () => (await import('../../src/index.js')).Host;
void loadHost;
