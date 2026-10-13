import { describe, expect, it } from 'vitest';
import { AppError } from '../../apps/web/shared/contracts';
import {
  parseTurn,
  validateHistory,
  validateSpeech,
  validateProjectCatalog,
  validateCapabilities,
  validateTurnEvent,
} from '../../apps/web/shared/validation';
const id = '11111111-1111-4111-8111-111111111111';
const catalog = {
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
const capabilities = {
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
};
function wav(samples = 0) {
  const bytes = new Uint8Array(44 + 2 * samples);
  const v = new DataView(bytes.buffer);
  const put = (at: number, text: string) =>
    bytes.set(new TextEncoder().encode(text), at);
  put(0, 'RIFF');
  v.setUint32(4, bytes.length - 8, true);
  put(8, 'WAVE');
  put(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 16000, true);
  v.setUint32(28, 32000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  put(36, 'data');
  v.setUint32(40, 2 * samples, true);
  return bytes;
}
async function multipart(parts: Array<[string, string | Blob]>) {
  const form = new FormData();
  for (const [key, value] of parts) form.append(key, value);
  const r = new Request('http://localhost/', { method: 'POST', body: form });
  return {
    bytes: new Uint8Array(await r.arrayBuffer()),
    type: r.headers.get('content-type')!,
  };
}
async function text(
  value = 'hello',
  extra: Array<[string, string | Blob]> = [],
) {
  return multipart([
    ['turnId', id],
    ['history', '[]'],
    ['text', value],
    ...extra,
  ]);
}
async function audio(bytes: Uint8Array, type = 'audio/wav') {
  return multipart([
    ['turnId', id],
    ['history', '[]'],
    ['audio', new Blob([bytes.buffer as ArrayBuffer], { type })],
  ]);
}
async function parse(x: Promise<{ bytes: Uint8Array; type: string }>) {
  const v = await x;
  return parseTurn(v.bytes, v.type);
}
it('preserves supplied typed text and exact 2000 UTF16 units', async () => {
  expect(await parse(text('  hello  '))).toEqual({
    turnId: id,
    history: [],
    kind: 'text',
    text: '  hello  ',
  });
  expect((await parse(text('😀'.repeat(1000)))).kind).toBe('text');
});
it.each(['x'.repeat(2001), '😀'.repeat(1001), '  '])(
  'rejects empty or overlong typed input',
  async (value) => {
    await expect(parse(text(value))).rejects.toMatchObject({
      httpStatus: 400,
      code: 'INVALID_REQUEST',
      retryable: false,
    });
  },
);
it.each([
  ['text', 'duplicate'],
  ['turnId', id],
  ['history', '[]'],
  ['tools', '[]'],
  ['audio', new Blob([wav().buffer], { type: 'audio/wav' })],
] as Array<[string, string | Blob]>)(
  'rejects duplicate/extra/both input field %s',
  async (key, value) => {
    await expect(parse(text('hi', [[key, value]]))).rejects.toBeInstanceOf(
      AppError,
    );
  },
);
it('rejects neither input, invalid UUID, JSON and file-valued string fields', async () => {
  for (const parts of [
    [
      ['turnId', id],
      ['history', '[]'],
    ],
    [
      ['turnId', 'wrong'],
      ['history', '[]'],
      ['text', 'hi'],
    ],
    [
      ['turnId', id],
      ['history', '{'],
      ['text', 'hi'],
    ],
    [
      ['turnId', new Blob(['id'])],
      ['history', '[]'],
      ['text', 'hi'],
    ],
  ] as Array<Array<[string, string | Blob]>>) {
    await expect(parse(multipart(parts))).rejects.toMatchObject({
      code: 'INVALID_REQUEST',
    });
  }
});
it('rejects unbounded bytes independently before parsing', async () => {
  await expect(
    parseTurn(new Uint8Array(2097153), 'multipart/form-data; boundary=x'),
  ).rejects.toMatchObject({
    httpStatus: 413,
    code: 'BODY_TOO_LARGE',
    turnId: null,
  });
});
it.each([
  'application/json',
  'multipart/form-data',
  'multipart/form-data; boundary=',
  'multipart/form-data; boundary=x; boundary=y',
])('rejects invalid multipart content type %s', async (type) => {
  await expect(parseTurn(new Uint8Array(), type)).rejects.toBeInstanceOf(
    AppError,
  );
});
it('accepts empty PCM and exactly 30 seconds with WAV MIME case-insensitivity', async () => {
  for (const count of [0, 480000]) {
    const result = await parse(audio(wav(count), 'Audio/Wav'));
    expect(result).toEqual({
      turnId: id,
      history: [],
      kind: 'audio',
      wav: wav(count),
    });
  }
});
it.each(['audio/mpeg', '', 'audio/wav; codecs=pcm'])(
  'rejects audio MIME %s',
  async (type) => {
    await expect(parse(audio(wav(1), type))).rejects.toMatchObject({
      code: 'INVALID_REQUEST',
    });
  },
);
it('rejects excess samples', async () => {
  await expect(parse(audio(wav(480001)))).rejects.toBeInstanceOf(AppError);
});
it.each([
  [4, 1, 4],
  [16, 15, 4],
  [20, 3, 2],
  [22, 2, 2],
  [24, 24000, 4],
  [28, 1, 4],
  [32, 1, 2],
  [34, 8, 2],
  [40, 1, 4],
])('rejects malformed WAV field at %s', async (at, value, size) => {
  const b = wav(2);
  const v = new DataView(b.buffer);
  if (size === 2) v.setUint16(at, value, true);
  else v.setUint32(at, value, true);
  await expect(parse(audio(b))).rejects.toBeInstanceOf(AppError);
});
it('skips padded unknown WAV chunks but rejects truncated or duplicate fmt/data', async () => {
  const b = wav(1);
  const unknown = new Uint8Array([74, 85, 78, 75, 1, 0, 0, 0, 7, 0]);
  const out = new Uint8Array(b.length + unknown.length);
  out.set(b.slice(0, 12));
  out.set(unknown, 12);
  out.set(b.slice(12), 22);
  new DataView(out.buffer).setUint32(4, out.length - 8, true);
  expect((await parse(audio(out))).kind).toBe('audio');
  for (const chunk of [b.slice(12, 36), b.slice(36)]) {
    const dup = new Uint8Array(b.length + chunk.length);
    dup.set(b);
    dup.set(chunk, b.length);
    new DataView(dup.buffer).setUint32(4, dup.length - 8, true);
    await expect(parse(audio(dup))).rejects.toBeInstanceOf(AppError);
  }
  await expect(parse(audio(out.slice(0, -1)))).rejects.toBeInstanceOf(AppError);
});
describe('public schemas', () => {
  it('clones the exact delivered catalog and validates empty records', () => {
    const got = validateProjectCatalog(catalog);
    expect(got).toEqual(catalog);
    got.records[0].name = 'changed';
    expect(catalog.records[0].name).toBe('Atlas');
    expect(validateProjectCatalog({ ...catalog, records: [] })).toEqual({
      ...catalog,
      records: [],
    });
  });
  it.each([
    { ...catalog, extra: 1 },
    { ...catalog, schemaVersion: 2 },
    { ...catalog, source: 'private' },
    ...[-1, 1.5, Infinity].map((openItems) => ({
      ...catalog,
      records: [{ ...catalog.records[0], openItems }],
    })),
    { ...catalog, records: [{ ...catalog.records[0], status: 'bad' }] },
    { ...catalog, records: [{ ...catalog.records[0], name: '' }] },
  ])('rejects invalid project catalog', (value) =>
    expect(() => validateProjectCatalog(value)).toThrow(AppError),
  );
  it('clones capabilities including nested metadata', () => {
    const got = validateCapabilities(capabilities);
    expect(got).toEqual(capabilities);
    got.search.reason = 'changed';
    expect(capabilities.search.reason).toBe(
      'Mock/Contract Simulation does not verify hosted search.',
    );
  });
  it.each([
    { ...capabilities, anthropicKey: 'secret' },
    { ...capabilities, mode: 'unknown' },
    { ...capabilities, model: 1 },
    ...[0, 121, 1.5, NaN].map((segmentChars) => ({
      ...capabilities,
      speech: { ...capabilities.speech, segmentChars },
    })),
    { ...capabilities, speech: { ...capabilities.speech, backlogChars: 1 } },
    {
      ...capabilities,
      search: { ...capabilities.search, accountValidation: 'yes' },
    },
  ])('rejects invalid capability or credential extras', (value) =>
    expect(() => validateCapabilities(value)).toThrow(AppError),
  );
  it('validates event payloads and clones nested catalog', () => {
    const event = {
      schemaVersion: 1,
      turnId: id,
      seq: 4,
      type: 'tool.completed',
      data: { result: catalog },
    };
    const got = validateTurnEvent(event);
    expect(got).toEqual(event);
    expect(got).not.toBe(event);
  });
  it.each([
    {
      schemaVersion: 1,
      turnId: id,
      seq: 0,
      type: 'turn.accepted',
      data: { mode: 'mock', key: 'secret' },
    },
    {
      schemaVersion: 2,
      turnId: id,
      seq: 0,
      type: 'turn.accepted',
      data: { mode: 'mock' },
    },
    ...[-1, 0.5, Infinity].map((seq) => ({
      schemaVersion: 1,
      turnId: id,
      seq,
      type: 'answer.delta',
      data: { text: 'x' },
    })),
    {
      schemaVersion: 1,
      turnId: 'bad',
      seq: 0,
      type: 'answer.delta',
      data: { text: 'x' },
    },
    {
      schemaVersion: 1,
      turnId: id,
      seq: 0,
      type: 'stage',
      data: { stage: 'thinking' },
    },
    ...[NaN, -1, 1.5].map((outputTokens) => ({
      schemaVersion: 1,
      turnId: id,
      seq: 1,
      type: 'turn.completed',
      data: { status: 'complete', text: '', usage: { outputTokens } },
    })),
  ])('rejects invalid event/schema/usage', (value) =>
    expect(() => validateTurnEvent(value)).toThrow(AppError),
  );
  it('accepts at most four alternating inbound pairs and 16000 chars without trimming', () => {
    const messages = Array.from({ length: 8 }, (_, i) => ({
      role: i % 2 ? 'assistant' : 'user',
      content: 'x'.repeat(2000),
    }));
    expect(validateHistory(messages)).toEqual(messages);
    const got = validateHistory(messages);
    got[0].content = 'changed';
    expect(messages[0].content.length).toBe(2000);
  });
  it.each(
    [
      [{ role: 'user', content: 'hi' }],
      [
        { role: 'assistant', content: 'x' },
        { role: 'user', content: 'y' },
      ],
      [
        { role: 'user', content: 'x'.repeat(16000) },
        { role: 'assistant', content: 'y' },
      ],
      [
        { role: 'user', content: 1 },
        { role: 'assistant', content: 'y' },
      ],
      Array.from({ length: 9 }, (_, i) => ({
        role: i % 2 ? 'assistant' : 'user',
        content: 'x',
      })),
    ].map((value) => [value]),
  )('rejects malformed or oversized inbound history', (value) =>
    expect(() => validateHistory(value)).toThrow(AppError),
  );
  it('validates speech at the supplied cap and copies input', () => {
    const input = {
      turnId: id,
      segmentId: 's'.repeat(80),
      text: 'x'.repeat(84),
    };
    expect(validateSpeech(input, 84)).toEqual(input);
    expect(validateSpeech(input, 84)).not.toBe(input);
  });
  it.each([
    { turnId: id, segmentId: '', text: 'hello' },
    { turnId: id, segmentId: 's'.repeat(81), text: 'hello' },
    { turnId: 'wrong', segmentId: 's', text: 'hello' },
    { turnId: id, segmentId: 's', text: 'x'.repeat(85) },
    { turnId: id, segmentId: 's', text: ' ' },
    { turnId: id, segmentId: 's', text: 'hello', extra: 1 },
  ])('rejects malformed speech', (value) =>
    expect(() => validateSpeech(value, 84)).toThrow(AppError),
  );
  it.each([0, 121, 1.5, NaN])(
    'rejects invalid effective speech cap %s',
    (cap) =>
      expect(() =>
        validateSpeech({ turnId: id, segmentId: 's', text: 'hi' }, cap),
      ).toThrow(AppError),
  );
});

it('rejects a failure payload UUID different from its envelope correlation', () => {
  const failure = {
    schemaVersion: 1,
    turnId: id,
    seq: 1,
    type: 'turn.failed',
    data: {
      code: 'MODEL_FAILED',
      message: 'Model failed.',
      turnId: '22222222-2222-4222-8222-222222222222',
      retryable: false,
    },
  };
  expect(() => validateTurnEvent(failure)).toThrow(AppError);
});
it.each([id, null])('preserves failure payload correlation %s', (turnId) => {
  const failure = {
    schemaVersion: 1,
    turnId: id,
    seq: 1,
    type: 'turn.failed',
    data: {
      code: 'MODEL_FAILED',
      message: 'Model failed.',
      turnId,
      retryable: false,
    },
  };
  expect(validateTurnEvent(failure)).toEqual(failure);
});
