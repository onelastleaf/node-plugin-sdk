import path from 'node:path';
import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const definition = protoLoader.loadSync(path.join(root, 'proto/oll/plugin.proto'), {
  includeDirs: [path.join(root, 'proto')],
  longs: String,
  enums: String,
  defaults: false,
  oneofs: true,
});

export const protocol = grpc.loadPackageDefinition(definition).oll.protocol;
export { grpc };
