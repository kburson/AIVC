import { expect, it } from 'vitest';
import { createRetrievalApp } from '../../apps/retrieval/src/http/app';
it('returns exact synthetic records and refuses malformed queries', async () => {
  const app = createRetrievalApp();
  try {
    const all = await app.inject('/v1/projects');
    expect(all.statusCode).toBe(200);
    expect(all.json()).toEqual({
      schemaVersion: 1,
      source: 'synthetic-project-catalog',
      records: [
        {
          id: 'atlas',
          name: 'Atlas',
          status: 'active',
          ownerTeam: 'North',
          openItems: 3,
          summary:
            'Synthetic active project owned by North with three open items.',
        },
        {
          id: 'beacon',
          name: 'Beacon',
          status: 'paused',
          ownerTeam: 'West',
          openItems: 1,
          summary: 'Synthetic paused project owned by West with one open item.',
        },
        {
          id: 'cedar',
          name: 'Cedar',
          status: 'complete',
          ownerTeam: 'South',
          openItems: 0,
          summary:
            'Synthetic completed project owned by South with no open items.',
        },
      ],
    });
    expect(
      (await app.inject('/v1/projects?name=aTlAs')).json().records,
    ).toHaveLength(1);
    expect((await app.inject('/v1/projects?name=Atl')).json().records).toEqual(
      [],
    );
    for (const query of [
      'name=',
      'name=Atlas&name=Beacon',
      'foo=1',
      'name=%E0%A4%A',
      'name=%FF',
      'name=' + 'a'.repeat(201),
      '__proto__=x',
      'name[x]=Atlas',
    ]) {
      expect(
        (await app.inject('/v1/projects?' + query)).statusCode,
        query,
      ).toBe(400);
    }
    expect((await app.inject('/health')).json()).toEqual({ status: 'ok' });
  } finally {
    await app.close();
  }
});
