// Mock/Contract Simulation: no provider, hosted search or live evidence.
import type {
  Capabilities,
  EventPayloads,
  TurnEvent,
} from '../../apps/web/shared/contracts';
import {
  validateTurnEvent,
  validateCapabilities,
} from '../../apps/web/shared/validation';
export const wireTurnId = '11111111-1111-4111-8111-111111111111';
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
export const wireDeltaFixture: readonly string[] = freeze([
  'Let me check Atlas.',
  '\n\n',
  'Atlas is active, owned by North, with 3 open items.',
]);
const atlasCatalog = {
  schemaVersion: 1,
  source: 'synthetic-project-catalog',
  records: [
    {
      id: 'atlas',
      name: 'Atlas',
      status: 'active',
      ownerTeam: 'North',
      openItems: 3,
      summary: 'Synthetic active project owned by North with three open items.',
    },
  ],
};
const payloads: Array<{
  type: keyof EventPayloads;
  data: EventPayloads[keyof EventPayloads];
}> = [
  { type: 'turn.accepted', data: { mode: 'mock' } },
  { type: 'stage', data: { stage: 'researching' } },
  { type: 'answer.delta', data: { text: 'Let me check Atlas.' } },
  {
    type: 'tool.started',
    data: { name: 'lookup_projects', summary: 'Lookup Atlas' },
  },
  { type: 'stage', data: { stage: 'retrieving' } },
  {
    type: 'tool.completed',
    data: {
      result: {
        ...atlasCatalog,
        schemaVersion: 1,
        source: 'synthetic-project-catalog',
        records: atlasCatalog.records.map((r) => ({ ...r, status: 'active' })),
      },
    },
  },
  { type: 'stage', data: { stage: 'answering' } },
  { type: 'answer.delta', data: { text: '\n\n' } },
  {
    type: 'answer.delta',
    data: { text: 'Atlas is active, owned by North, with 3 open items.' },
  },
  {
    type: 'turn.completed',
    data: {
      text: 'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
      status: 'complete',
      usage: { inputTokens: 20, outputTokens: 30, searchUses: 0 },
    },
  },
];
export const wireEvents: readonly TurnEvent[] = freeze(
  payloads.map((payload, seq) =>
    validateTurnEvent({
      schemaVersion: 1,
      turnId: wireTurnId,
      seq,
      ...payload,
    }),
  ),
);
export const mockCapabilities: Capabilities = freeze(
  validateCapabilities({
    schemaVersion: 1,
    mode: 'mock',
    model: null,
    sttModel: null,
    ttsModel: null,
    build: { mode: 'development', buildId: null },
    turnsAvailable: true,
    speechAvailable: false,
    search: {
      state: 'unavailable',
      reason: 'Mock/Contract Simulation does not verify hosted search.',
      accountValidation: 'unavailable',
    },
    speech: {
      segmentChars: 84,
      backlogChars: 2400,
      highWaterSeconds: 10,
      lowWaterSeconds: 2,
    },
  }),
);
export const invalidWireValues: readonly unknown[] = freeze([
  {
    schemaVersion: 2,
    turnId: wireTurnId,
    seq: 0,
    type: 'turn.accepted',
    data: { mode: 'mock' },
  },
  {
    schemaVersion: 1,
    turnId: wireTurnId,
    seq: 0,
    type: 'stage',
    data: { stage: 'thinking' },
  },
  {
    schemaVersion: 1,
    turnId: wireTurnId,
    seq: 0,
    type: 'answer.delta',
    data: { text: 'answer', rawProvider: { thinking: 'private' } },
  },
]);
