import { Ajv } from 'ajv';
export type ProjectRecord = {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'complete';
  ownerTeam: string;
  openItems: number;
  summary: string;
};
export type ProjectCatalog = {
  schemaVersion: 1;
  source: 'synthetic-project-catalog';
  records: ProjectRecord[];
};
export const projectCatalogSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['schemaVersion', 'source', 'records'],
  properties: {
    schemaVersion: { const: 1 },
    source: { const: 'synthetic-project-catalog' },
    records: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'status', 'ownerTeam', 'openItems', 'summary'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          status: { type: 'string', enum: ['active', 'paused', 'complete'] },
          ownerTeam: { type: 'string', minLength: 1 },
          openItems: { type: 'integer', minimum: 0 },
          summary: { type: 'string', minLength: 1 },
        },
      },
    },
  },
} as const;
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  removeAdditional: false,
});
const validate = ajv.compile<ProjectCatalog>(projectCatalogSchema);
export function loadCatalog(value: unknown): ProjectCatalog {
  if (!validate(value))
    throw new Error(
      'Invalid project catalog: ' + ajv.errorsText(validate.errors),
    );
  return value;
}
