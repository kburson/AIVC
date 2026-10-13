import Fastify, { type FastifyInstance } from 'fastify';
import { lookupProjects } from '../projects/catalog.js';
import { projectCatalogSchema } from '../projects/schema.js';
export function parseProjectQuery(raw: string): Record<string, unknown> {
  const query: Record<string, unknown> = Object.create(null);
  if (raw === '') return query;
  try {
    for (const field of raw.split('&')) {
      const split = field.indexOf('=');
      const decode = (part: string) =>
        decodeURIComponent(part.replace(/\+/g, ' '));
      const key = decode(split < 0 ? field : field.slice(0, split));
      const value = decode(split < 0 ? '' : field.slice(split + 1));
      if (Object.hasOwn(query, key)) {
        const previous = query[key];
        query[key] = Array.isArray(previous)
          ? [...previous, value]
          : [previous, value];
      } else query[key] = value;
    }
    return query;
  } catch {
    return { __malformedQuery: true };
  }
}
export function createRetrievalApp(): FastifyInstance {
  const app = Fastify({
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false } },
    routerOptions: { querystringParser: parseProjectQuery },
  });
  app.get<{ Querystring: { name?: string } }>(
    '/v1/projects',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 200 },
          },
        },
        response: { 200: projectCatalogSchema },
      },
    },
    (request) => lookupProjects(request.query.name),
  );
  app.get('/health', () => ({ status: 'ok' }));
  return app;
}
