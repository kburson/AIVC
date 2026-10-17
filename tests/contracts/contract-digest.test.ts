import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { computeContractDigest } from '../../scripts/contract-digest.mjs';
const paths = [
  'packages/contracts/src/contracts.ts',
  'packages/contracts/src/history.ts',
  'packages/contracts/src/index.ts',
  'packages/contracts/src/interface-policy.ts',
  'packages/contracts/src/json.ts',
  'packages/contracts/src/sse.ts',
  'packages/contracts/src/validation.ts',
  'tests/helpers/wire-contract-fixtures.ts',
];
const values = new Map(
  paths.map((path, i) => [path, new Uint8Array([i, 10, 0, 255])]),
);
function expected(names = paths) {
  const parts: Uint8Array[] = [];
  for (const [i, path] of names.entries())
    parts.push(
      Buffer.from(path),
      Buffer.from([0]),
      Buffer.from('4'),
      Buffer.from([0]),
      new Uint8Array([i, 10, 0, 255]),
      Buffer.from([0]),
    );
  return (
    'sha256:' + createHash('sha256').update(Buffer.concat(parts)).digest('hex')
  );
}
describe('closed eight-file public source digest', () => {
  it('matches independent raw path/NUL/decimal byteLength framing in ASCII path order', () => {
    const seen: string[] = [];
    const read = (path: string) => {
      seen.push(path);
      return values.get(path)!;
    };
    expect(computeContractDigest(read)).toBe(expected());
    expect(seen).toEqual(paths);
    expect(computeContractDigest((path) => values.get(path)!)).toBe(expected());
  });
  it('reacts to one raw byte, newline and BOM change without normalization', () => {
    const baseline = computeContractDigest((path) => values.get(path)!);
    for (const changed of [
      new Uint8Array([9, 10, 0, 255]),
      new Uint8Array([0, 13, 10, 0, 255]),
      new Uint8Array([239, 187, 191, 0, 10, 0, 255]),
    ])
      expect(
        computeContractDigest((path) =>
          path === paths[0] ? changed : values.get(path)!,
        ),
      ).not.toBe(baseline);
  });
  it('covers path labels while excluding doc/probe/unrelated inputs', () => {
    expect(computeContractDigest((path) => values.get(path)!)).not.toBe(
      expected(['changed-path', ...paths.slice(1)]),
    );
    const extended = new Map(values);
    extended.set('docs/contracts/voice-bff-v1.md', new Uint8Array([1]));
    extended.set('apps/web/client/contract-probe.tsx', new Uint8Array([2]));
    expect(computeContractDigest((path) => extended.get(path)!)).toBe(
      expected(),
    );
    extended.set('docs/contracts/voice-bff-v1.md', new Uint8Array([9]));
    expect(computeContractDigest((path) => extended.get(path)!)).toBe(
      expected(),
    );
  });
  it('fails when any required input is missing', () => {
    expect(() =>
      computeContractDigest(() => {
        throw new Error('Missing required source');
      }),
    ).toThrow('Missing required source');
  });
});
