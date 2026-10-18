import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import {
  wireEvents,
  wireDeltaFixture,
  mockCapabilities,
  invalidWireValues,
} from '../helpers/wire-contract-fixtures';
import {
  validateTurnEvent,
  validateCapabilities,
  validateProjectCatalog,
} from '@aivc/contracts';
import { assertTurnSequence } from '@aivc/contracts';
const root = fileURLToPath(new URL('../../', import.meta.url));
it('pins immutable simulated Atlas sequence and actual delivered catalog without a live claim', () => {
  assertTurnSequence(wireEvents);
  expect(wireEvents.map((e) => e.type)).toEqual([
    'turn.accepted',
    'stage',
    'answer.delta',
    'tool.started',
    'stage',
    'tool.completed',
    'stage',
    'answer.delta',
    'answer.delta',
    'turn.completed',
  ]);
  expect(
    wireEvents.filter((e) => e.type === 'answer.delta').map((e) => e.data.text),
  ).toEqual([
    'Let me check Atlas.',
    '\n\n',
    'Atlas is active, owned by North, with 3 open items.',
  ]);
  expect(wireDeltaFixture).toEqual([
    'Let me check Atlas.',
    '\n\n',
    'Atlas is active, owned by North, with 3 open items.',
  ]);
  const delivered = validateProjectCatalog(
    JSON.parse(
      readFileSync(
        resolve(root, 'apps/retrieval/fixtures/projects.json'),
        'utf8',
      ),
    ),
  );
  const tool = wireEvents.find((e) => e.type === 'tool.completed')!;
  expect(tool.data.result).toEqual({
    ...delivered,
    records: delivered.records.filter((r) => r.id === 'atlas'),
  });
  expect(wireEvents.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: {
      text: 'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
      status: 'complete',
      usage: { inputTokens: 20, outputTokens: 30, searchUses: 0 },
    },
  });
  expect(Object.isFrozen(wireEvents)).toBe(true);
  expect(Object.isFrozen(tool.data.result.records[0])).toBe(true);
  expect(validateCapabilities(mockCapabilities).search).toEqual({
    state: 'unavailable',
    reason: 'Mock/Contract Simulation does not verify hosted search.',
    accountValidation: 'unavailable',
  });
  for (const e of wireEvents) expect(validateTurnEvent(e)).toEqual(e);
  for (const value of invalidWireValues)
    expect(() => validateTurnEvent(value)).toThrow();
});
