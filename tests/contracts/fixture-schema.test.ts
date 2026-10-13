import { expect, it } from 'vitest';
import { loadCatalog } from '../../apps/retrieval/src/projects/schema';
const valid = {
  schemaVersion: 1,
  source: 'synthetic-project-catalog',
  records: [
    {
      id: 'atlas',
      name: 'Atlas',
      status: 'active',
      ownerTeam: 'North',
      openItems: 3,
      summary: 'Synthetic fixture.',
    },
  ],
};
it('accepts a valid catalog independently of HTTP serialization', () => {
  expect(loadCatalog(valid)).toEqual(valid);
});
it.each([
  null,
  {},
  { ...valid, extra: true },
  { ...valid, schemaVersion: 2 },
  { ...valid, records: [{ ...valid.records[0], status: 'unknown' }] },
  { ...valid, records: [{ ...valid.records[0], openItems: -1 }] },
  { ...valid, records: [{ ...valid.records[0], openItems: 1.2 }] },
  { ...valid, records: [{ ...valid.records[0], ownerTeam: undefined }] },
])('fails invalid fixture startup %#', (value) => {
  expect(() => loadCatalog(value)).toThrow(/catalog/i);
});
