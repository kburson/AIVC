import { expect, it } from 'vitest';
import {
  encodeSse,
  decodeSse,
  assertTurnSequence,
  SseDecodeError,
} from '../../apps/web/shared/sse';
import { validateTurnEvent } from '../../apps/web/shared/validation';
import type { TurnEvent } from '../../apps/web/shared/contracts';
import {
  wireEvents,
  wireTurnId,
  wireDeltaFixture,
} from '../helpers/wire-contract-fixtures';
const utf8 = new TextEncoder();
const acceptedRaw = utf8.encode(
  'event: turn.accepted\ndata: {"schemaVersion":1,"turnId":"11111111-1111-4111-8111-111111111111","seq":0,"type":"turn.accepted","data":{"mode":"mock"}}\n\n',
);
function event(type: string, data: unknown, seq: number) {
  return validateTurnEvent({
    schemaVersion: 1,
    turnId: wireTurnId,
    seq,
    type,
    data,
  });
}
function trace(items: Array<[string, unknown]>) {
  return items.map(([type, data], seq) => event(type, data, seq));
}
const accepted: [string, unknown] = ['turn.accepted', { mode: 'mock' }];
const ordinary = trace([
  accepted,
  ['answer.delta', { text: 'Hello 😀.' }],
  ['turn.completed', { text: 'Hello 😀.', status: 'complete' }],
]);
const rejectedAttempt = trace([
  accepted,
  ['stage', { stage: 'researching' }],
  ['answer.delta', { text: 'Try again.' }],
  ['turn.completed', { text: 'Try again.', status: 'complete' }],
]);
const failedLookup = trace([
  accepted,
  ['tool.started', { name: 'lookup_projects', summary: 'Lookup Atlas' }],
  ['stage', { stage: 'retrieving' }],
  [
    'turn.failed',
    {
      code: 'RETRIEVAL_UNAVAILABLE',
      message: 'Project retrieval is unavailable.',
      turnId: wireTurnId,
      retryable: false,
    },
  ],
]);
function raw(events: readonly TurnEvent[], ending = '\n\n') {
  return utf8.encode(
    events
      .map((e) => 'event: ' + e.type + '\ndata: ' + JSON.stringify(e) + ending)
      .join(''),
  );
}
async function* chunks(...pieces: Uint8Array[]) {
  for (const piece of pieces) yield piece;
}
async function collect(bytes: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const e of decodeSse(bytes)) result.push(e);
  return result;
}
async function rejects(bytes: Uint8Array, code: string) {
  await expect(collect(chunks(bytes))).rejects.toMatchObject({
    name: 'SseDecodeError',
    code,
  });
  await expect(collect(chunks(bytes))).rejects.toBeInstanceOf(SseDecodeError);
}
it('encodes independently authored canonical LF frame and actual separator bytes', () => {
  expect(encodeSse(wireEvents[0])).toEqual(acceptedRaw);
  expect(utf8.encode(wireDeltaFixture[1])).toEqual(new Uint8Array([10, 10]));
  const reversed = {
    data: { mode: 'mock' },
    type: 'turn.accepted',
    seq: 0,
    turnId: wireTurnId,
    schemaVersion: 1,
  };
  expect(encodeSse(validateTurnEvent(reversed))).toEqual(acceptedRaw);
});
it('preserves full normative Atlas events at every split and one byte chunks', async () => {
  const bytes = raw(wireEvents);
  for (let at = 0; at <= bytes.length; at++)
    expect(await collect(chunks(bytes.slice(0, at), bytes.slice(at)))).toEqual(
      wireEvents,
    );
  expect(
    await collect(chunks(...Array.from(bytes, (b) => new Uint8Array([b])))),
  ).toEqual(wireEvents);
  assertTurnSequence(wireEvents);
});
it('preserves emoji UTF8 CRLF multiline data comments and optional event labels at every split', async () => {
  const bytes = utf8.encode(
    ordinary
      .map(
        (e, i) =>
          ': heartbeat\r\n' +
          (i === 0 ? '' : 'event: ' + e.type + '\r\n') +
          'data: ' +
          JSON.stringify(e, null, 2).replaceAll('\n', '\r\ndata: ') +
          '\r\n\r\n',
      )
      .join(''),
  );
  for (let at = 0; at <= bytes.length; at++)
    expect(await collect(chunks(bytes.slice(0, at), bytes.slice(at)))).toEqual(
      ordinary,
    );
});
it('accepts all permitted stage/source/no-tool/audio/no-speech/truncated and rejected-attempt traces', async () => {
  const variants = [
    ordinary,
    rejectedAttempt,
    failedLookup,
    trace([
      accepted,
      ['stage', { stage: 'transcribing' }],
      ['transcript.final', { text: 'Question' }],
      ['stage', { stage: 'researching' }],
      ['stage', { stage: 'answering' }],
      ['answer.delta', { text: 'A' }],
      [
        'sources',
        {
          sources: [
            { title: 'Source', url: 'https://example.com', citedText: 'fact' },
          ],
        },
      ],
      ['stage', { stage: 'researching' }],
      ['answer.delta', { text: 'B' }],
      ['turn.completed', { text: 'AB', status: 'complete' }],
    ]),
    trace([
      accepted,
      ['stage', { stage: 'transcribing' }],
      ['turn.completed', { text: '', status: 'no-speech' }],
    ]),
    trace([
      accepted,
      ['answer.delta', { text: 'partial' }],
      ['turn.completed', { text: 'partial', status: 'truncated' }],
    ]),
  ];
  for (const events of variants) {
    expect(() => assertTurnSequence(events)).not.toThrow();
    expect(await collect(chunks(raw(events)))).toEqual(events);
  }
});
const invalidTraces = [
  [event('answer.delta', { text: 'x' }, 0)],
  [wireEvents[0], event('turn.accepted', { mode: 'mock' }, 1)],
  [wireEvents[0], event('turn.completed', { text: '', status: 'complete' }, 2)],
  [wireEvents[0], event('answer.delta', { text: 'x' }, 0)],
  [
    wireEvents[0],
    {
      ...event('turn.completed', { text: '', status: 'complete' }, 1),
      turnId: '22222222-2222-4222-8222-222222222222',
    },
  ],
  trace([
    accepted,
    ['stage', { stage: 'retrieving' }],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  trace([
    accepted,
    [
      'tool.completed',
      {
        result: {
          schemaVersion: 1,
          source: 'synthetic-project-catalog',
          records: [],
        },
      },
    ],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['tool.started', { name: 'lookup_projects', summary: 'rejected attempt' }],
    ['answer.delta', { text: 'continued' }],
    ['turn.completed', { text: 'continued', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['tool.started', { name: 'lookup_projects', summary: 'lookup' }],
    ['tool.started', { name: 'lookup_projects', summary: 'lookup' }],
  ]),
  trace([
    accepted,
    ['tool.started', { name: 'lookup_projects', summary: 'lookup' }],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['answer.delta', { text: 'actual' }],
    ['turn.completed', { text: 'different', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['answer.delta', { text: 'x' }],
    ['turn.completed', { text: '', status: 'no-speech' }],
  ]),
  trace([
    accepted,
    ['stage', { stage: 'researching' }],
    ['transcript.final', { text: 'late' }],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['transcript.final', { text: 'one' }],
    ['transcript.final', { text: 'two' }],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  trace([
    accepted,
    ['transcript.final', { text: 'one' }],
    ['stage', { stage: 'transcribing' }],
    ['turn.completed', { text: '', status: 'complete' }],
  ]),
  [
    ...failedLookup,
    event(
      'tool.completed',
      {
        result: {
          schemaVersion: 1,
          source: 'synthetic-project-catalog',
          records: [],
        },
      },
      4,
    ),
  ],
  [...failedLookup, event('answer.delta', { text: 'continued' }, 4)],
  [...ordinary, event('answer.delta', { text: 'after' }, 3)],
  [
    ...ordinary,
    event('turn.completed', { text: 'Hello 😀.', status: 'complete' }, 3),
  ],
];
it.each(invalidTraces.map((events, i) => [i, events] as const))(
  'rejects invalid ordering/text/sequence trace %s',
  async (_i, events) => {
    expect(() => assertTurnSequence(events)).toThrow(SseDecodeError);
    await rejects(raw(events), 'INVALID_STREAM');
  },
);
it.each([
  '',
  'data: {"schemaVersion":1',
  'event: turn.failed\ndata: {"schemaVersion":1',
])(
  'classifies empty or interrupted unterminated JSON as disconnect',
  async (value) => {
    await rejects(utf8.encode(value), 'STREAM_DISCONNECTED');
  },
);
it('distinguishes terminated malformed JSON and schemas from interrupted final JSON', async () => {
  await rejects(utf8.encode('data: {\n\n'), 'INVALID_STREAM');
  await rejects(utf8.encode('data: {}'), 'INVALID_STREAM');
  await rejects(
    utf8.encode(
      'event: stage\ndata: ' + JSON.stringify(wireEvents[0]) + '\n\n',
    ),
    'INVALID_STREAM',
  );
  await rejects(
    new Uint8Array([
      ...acceptedRaw,
      ...utf8.encode('event: turn.failed\ndata: {"code":'),
    ]),
    'STREAM_DISCONNECTED',
  );
});
it('accepts valid unterminated terminal while yielding unterminated nonterminal before disconnect', async () => {
  expect(await collect(chunks(raw(ordinary).slice(0, -2)))).toEqual(ordinary);
  const yielded = [];
  let thrown;
  try {
    for await (const e of decodeSse(
      chunks(raw([ordinary[0], ordinary[1]]).slice(0, -2)),
    ))
      yielded.push(e);
  } catch (error) {
    thrown = error;
  }
  expect(yielded).toEqual(ordinary.slice(0, 2));
  expect(thrown).toMatchObject({ code: 'STREAM_DISCONNECTED' });
  expect(() => assertTurnSequence([ordinary[0]])).toThrow(SseDecodeError);
});
it('wraps read rejection with cause and preserves consumer AbortError', async () => {
  const cause = new Error('lost connection');
  async function* fail() {
    yield acceptedRaw;
    throw cause;
  }
  await expect(collect(fail())).rejects.toMatchObject({
    code: 'STREAM_DISCONNECTED',
    cause,
  });
  const abort = new DOMException('cancel', 'AbortError');
  async function* stop() {
    yield acceptedRaw;
    throw abort;
  }
  await expect(collect(stop())).rejects.toBe(abort);
});

it('preserves caller AbortError even when upstream iterator cleanup rejects', async () => {
  const abort = new DOMException('cancel', 'AbortError');
  const source: AsyncIterable<Uint8Array> = {
    [Symbol.asyncIterator]() {
      return {
        next: async () => {
          throw abort;
        },
        return: async () => {
          throw new Error('cleanup failed');
        },
      };
    },
  };
  await expect(collect(source)).rejects.toBe(abort);
});
it('classifies invalid terminal schema and sequence at unterminated EOF as protocol failures', async () => {
  const bad = { ...ordinary[2], seq: 9 };
  const bytes = utf8.encode(
    'data: ' + JSON.stringify(ordinary[0]) + '\n\ndata: ' + JSON.stringify(bad),
  );
  await rejects(bytes, 'INVALID_STREAM');
  const extra = {
    ...ordinary[2],
    data: { ...ordinary[2].data, thinking: 'private' },
  };
  await rejects(
    utf8.encode(
      'data: ' +
        JSON.stringify(ordinary[0]) +
        '\n\ndata: ' +
        JSON.stringify(extra),
    ),
    'INVALID_STREAM',
  );
});

it('classifies iterator acquisition failure as a disconnected stream with its cause', async () => {
  const cause = new Error('transport unavailable');
  const source: AsyncIterable<Uint8Array> = {
    [Symbol.asyncIterator]() {
      throw cause;
    },
  };
  await expect(collect(source)).rejects.toMatchObject({
    name: 'SseDecodeError',
    code: 'STREAM_DISCONNECTED',
    cause,
  });
});

function failedWithPayloadId(turnId: string | null): TurnEvent {
  return {
    schemaVersion: 1,
    turnId: wireTurnId,
    seq: 1,
    type: 'turn.failed',
    data: {
      code: 'MODEL_FAILED',
      message: 'Model failed.',
      turnId,
      retryable: false,
    },
  };
}
it('rejects a collected failure payload correlated to another UUID', () => {
  const events = [
    wireEvents[0],
    failedWithPayloadId('22222222-2222-4222-8222-222222222222'),
  ];
  expect(() => assertTurnSequence(events)).toThrow(SseDecodeError);
  expect(() => assertTurnSequence(events)).toThrowError(
    expect.objectContaining({ code: 'INVALID_STREAM' }),
  );
});
it.each([true, false])(
  'rejects mismatched failure correlation in streaming terminal with delimiter %s',
  async (terminated) => {
    const bytes = raw([
      wireEvents[0],
      failedWithPayloadId('22222222-2222-4222-8222-222222222222'),
    ]);
    await rejects(terminated ? bytes : bytes.slice(0, -2), 'INVALID_STREAM');
  },
);
it.each([wireTurnId, null])(
  'preserves matching or nullable failure correlation %s throughout collected and streaming validation',
  async (turnId) => {
    const events = [wireEvents[0], failedWithPayloadId(turnId)];
    expect(() => assertTurnSequence(events)).not.toThrow();
    expect(await collect(chunks(raw(events)))).toEqual(events);
    expect(await collect(chunks(raw(events).slice(0, -2)))).toEqual(events);
  },
);
