import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = new URL('../', import.meta.url);
const paths = [
  'apps/web/shared/contracts.ts',
  'apps/web/shared/history.ts',
  'apps/web/shared/sse.ts',
  'apps/web/shared/validation.ts',
  'tests/helpers/wire-contract-fixtures.ts',
];
export function computeContractDigest(read) {
  const hash = createHash('sha256');
  for (const path of paths) {
    const bytes = read(path);
    hash.update(path, 'utf8');
    hash.update(Buffer.from([0]));
    hash.update(String(bytes.byteLength), 'ascii');
    hash.update(Buffer.from([0]));
    hash.update(bytes);
    hash.update(Buffer.from([0]));
  }
  return 'sha256:' + hash.digest('hex');
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(
    computeContractDigest((path) =>
      readFileSync(fileURLToPath(new URL(path, root))),
    ),
  );
