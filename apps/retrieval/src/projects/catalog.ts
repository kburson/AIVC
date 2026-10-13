import { readFileSync } from 'node:fs';
import { loadCatalog, type ProjectCatalog } from './schema.js';
const catalog = loadCatalog(
  JSON.parse(
    readFileSync(
      new URL('../../fixtures/projects.json', import.meta.url),
      'utf8',
    ),
  ),
);
export function lookupProjects(name?: string): ProjectCatalog {
  return {
    schemaVersion: 1,
    source: 'synthetic-project-catalog',
    records: catalog.records
      .filter(
        (r) =>
          name === undefined || r.name.toLowerCase() === name.toLowerCase(),
      )
      .map((r) => ({ ...r })),
  };
}
