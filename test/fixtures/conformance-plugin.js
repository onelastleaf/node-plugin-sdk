import { createHash } from 'node:crypto';
import { ActionResult, Plugin } from '../../src/index.js';

const plugin = new Plugin('org.onelastleaf.conformance', '0.1.0')
  .action('echo', 'Echo arguments', async (_context, arguments_) =>
    ActionResult.string(arguments_.join(' ')))
  .action('wait', 'Wait for cancellation', async (context) => {
    if (!context.signal.aborted) {
      await new Promise((resolve) => context.signal.addEventListener('abort', resolve, { once: true }));
    }
    return new ActionResult();
  })
  .action('host', 'Exercise host capabilities', async (context) => {
    const configured = await context.getConfig();
    const invoked = await context.invokeConfigFunction(
      configured.value.functionValue,
      [{ stringValue: 'config' }],
    );
    const document = await context.hostCall({
      readDocument: {
        path: { value: '/conformance.md' },
        projection: 'DOCUMENT_PROJECTION_CONTENT',
      },
    });
    await context.log('LOG_LEVEL_INFO', 'conformance', 'host action complete');
    return ActionResult.string(
      `${invoked.results[0].stringValue}|${document.readDocument.document.content}`,
    );
  })
  .action('artifact', 'Exercise artifact transfer', async (context) => {
    const payload = Buffer.from('artifact payload');
    const descriptor = {
      artifactId: { value: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' },
      fileName: 'conformance.txt',
      mediaType: 'text/plain',
      sizeBytes: String(payload.length),
      sha256: createHash('sha256').update(payload).digest(),
    };
    await context.storeArtifact(descriptor, [Buffer.from('artifact '), Buffer.from('payload')]);
    return new ActionResult({ stringValue: 'artifact' }, [descriptor]);
  });

await plugin.run();
