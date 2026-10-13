import { AppError } from './contracts';
import type {
  TurnInput,
  HistoryMessage,
  SpeechInput,
  ProjectCatalog,
  Capabilities,
  TurnEvent,
  Usage,
  Source,
} from './contracts';
function invalid(): never {
  throw new AppError(400, 'INVALID_REQUEST', 'Invalid request.', null, false);
}
function object(
  value: unknown,
  required: readonly string[],
  optional: readonly string[] = [],
): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value))
    invalid();
  const obj = value as Record<string, unknown>;
  if (
    required.some((key) => !Object.hasOwn(obj, key)) ||
    Object.keys(obj).some(
      (key) => !required.includes(key) && !optional.includes(key),
    )
  )
    invalid();
  return obj;
}
function str(value: unknown, nonempty = false): string {
  if (typeof value !== 'string' || (nonempty && !value.length)) invalid();
  return value;
}
function bool(value: unknown): boolean {
  if (typeof value !== 'boolean') invalid();
  return value;
}
function integer(
  value: unknown,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    invalid();
  return value;
}
function literal<T extends string | number>(value: unknown, want: T): T {
  if (value !== want) invalid();
  return want;
}
function one<T extends string>(value: unknown, allowed: readonly T[]): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) invalid();
  return value as T;
}
function nullable(value: unknown): string | null {
  return value === null ? null : str(value);
}
function uuid(value: unknown): string {
  const s = str(value);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
  )
    invalid();
  return s;
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) invalid();
  return value;
}
export function validateProjectCatalog(value: unknown): ProjectCatalog {
  const v = object(value, ['schemaVersion', 'source', 'records']);
  return {
    schemaVersion: literal(v.schemaVersion, 1),
    source: literal(v.source, 'synthetic-project-catalog'),
    records: array(v.records).map((value) => {
      const r = object(value, [
        'id',
        'name',
        'status',
        'ownerTeam',
        'openItems',
        'summary',
      ]);
      return {
        id: str(r.id, true),
        name: str(r.name, true),
        status: one(r.status, ['active', 'paused', 'complete']),
        ownerTeam: str(r.ownerTeam, true),
        openItems: integer(r.openItems),
        summary: str(r.summary, true),
      };
    }),
  };
}
export function validateCapabilities(value: unknown): Capabilities {
  const v = object(value, [
    'schemaVersion',
    'mode',
    'model',
    'sttModel',
    'ttsModel',
    'build',
    'turnsAvailable',
    'speechAvailable',
    'search',
    'speech',
  ]);
  const b = object(v.build, ['mode', 'buildId']),
    s = object(v.search, ['state', 'reason', 'accountValidation']),
    p = object(v.speech, [
      'segmentChars',
      'backlogChars',
      'highWaterSeconds',
      'lowWaterSeconds',
    ]);
  return {
    schemaVersion: literal(v.schemaVersion, 1),
    mode: one(v.mode, ['live', 'mock']),
    model: nullable(v.model),
    sttModel: nullable(v.sttModel),
    ttsModel: nullable(v.ttsModel),
    build: {
      mode: one(b.mode, ['production', 'development']),
      buildId: nullable(b.buildId),
    },
    turnsAvailable: bool(v.turnsAvailable),
    speechAvailable: bool(v.speechAvailable),
    search: {
      state: one(s.state, [
        'disabled',
        'unavailable',
        'configured',
        'verified',
      ]),
      reason: nullable(s.reason),
      accountValidation: one(s.accountValidation, [
        'pending',
        'verified',
        'unavailable',
      ]),
    },
    speech: {
      segmentChars: integer(p.segmentChars, 1, 120),
      backlogChars: literal(p.backlogChars, 2400),
      highWaterSeconds: literal(p.highWaterSeconds, 10),
      lowWaterSeconds: literal(p.lowWaterSeconds, 2),
    },
  };
}
export function validateHistory(value: unknown): HistoryMessage[] {
  const values = array(value);
  if (values.length > 8 || values.length % 2) invalid();
  let total = 0;
  const messages = values.map((value, index) => {
    const m = object(value, ['role', 'content']);
    const role = literal(m.role, index % 2 ? 'assistant' : 'user');
    const content = str(m.content);
    total += content.length;
    return { role, content };
  });
  if (total > 16000) invalid();
  return messages;
}
export function validateSpeech(value: unknown, cap: number): SpeechInput {
  integer(cap, 1, 120);
  const v = object(value, ['turnId', 'segmentId', 'text']);
  const turnId = uuid(v.turnId),
    segmentId = str(v.segmentId),
    text = str(v.text);
  if (
    !segmentId.trim() ||
    segmentId.length > 80 ||
    !text.trim() ||
    text.length > cap
  )
    invalid();
  return { turnId, segmentId, text };
}
function usage(value: unknown): Usage {
  const v = object(value, [], ['inputTokens', 'outputTokens', 'searchUses']);
  const result: Usage = {};
  for (const k of ['inputTokens', 'outputTokens', 'searchUses'] as const)
    if (Object.hasOwn(v, k)) result[k] = integer(v[k]);
  return result;
}
function source(value: unknown): Source {
  const v = object(value, ['title', 'url'], ['citedText']);
  return {
    title: str(v.title),
    url: str(v.url),
    ...(Object.hasOwn(v, 'citedText') ? { citedText: str(v.citedText) } : {}),
  };
}
export function validateTurnEvent(value: unknown): TurnEvent {
  const v = object(value, ['schemaVersion', 'turnId', 'seq', 'type', 'data']);
  const base = {
    schemaVersion: literal(v.schemaVersion, 1),
    turnId: uuid(v.turnId),
    seq: integer(v.seq),
  };
  switch (v.type) {
    case 'turn.accepted': {
      const d = object(v.data, ['mode']);
      return {
        ...base,
        type: v.type,
        data: { mode: one(d.mode, ['live', 'mock']) },
      };
    }
    case 'transcript.final':
    case 'answer.delta': {
      const d = object(v.data, ['text']);
      return { ...base, type: v.type, data: { text: str(d.text) } };
    }
    case 'stage': {
      const d = object(v.data, ['stage']);
      return {
        ...base,
        type: v.type,
        data: {
          stage: one(d.stage, [
            'transcribing',
            'researching',
            'retrieving',
            'answering',
          ]),
        },
      };
    }
    case 'tool.started': {
      const d = object(v.data, ['name', 'summary']);
      return {
        ...base,
        type: v.type,
        data: {
          name: literal(d.name, 'lookup_projects'),
          summary: str(d.summary),
        },
      };
    }
    case 'tool.completed': {
      const d = object(v.data, ['result']);
      return {
        ...base,
        type: v.type,
        data: { result: validateProjectCatalog(d.result) },
      };
    }
    case 'sources': {
      const d = object(v.data, ['sources']);
      return {
        ...base,
        type: v.type,
        data: { sources: array(d.sources).map(source) },
      };
    }
    case 'turn.completed': {
      const d = object(v.data, ['text', 'status'], ['usage']);
      return {
        ...base,
        type: v.type,
        data: {
          text: str(d.text),
          status: one(d.status, ['complete', 'truncated', 'no-speech']),
          ...(Object.hasOwn(d, 'usage') ? { usage: usage(d.usage) } : {}),
        },
      };
    }
    case 'turn.failed': {
      const d = object(v.data, ['code', 'message', 'turnId', 'retryable']);
      return {
        ...base,
        type: v.type,
        data: {
          code: str(d.code),
          message: str(d.message),
          turnId: d.turnId === null ? null : uuid(d.turnId),
          retryable: bool(d.retryable),
        },
      };
    }
    default:
      return invalid();
  }
}
function validateWav(bytes: Uint8Array): void {
  if (bytes.length < 12) invalid();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const label = (at: number) =>
    String.fromCharCode(...bytes.subarray(at, at + 4));
  if (
    label(0) !== 'RIFF' ||
    label(8) !== 'WAVE' ||
    view.getUint32(4, true) !== bytes.length - 8
  )
    invalid();
  let at = 12,
    fmt = false,
    data = false;
  while (at < bytes.length) {
    if (at + 8 > bytes.length) invalid();
    const name = label(at),
      length = view.getUint32(at + 4, true),
      start = at + 8,
      end = start + length,
      next = end + (length % 2);
    if (next > bytes.length) invalid();
    if (name === 'fmt ') {
      if (fmt || length < 16) invalid();
      fmt = true;
      if (
        view.getUint16(start, true) !== 1 ||
        view.getUint16(start + 2, true) !== 1 ||
        view.getUint32(start + 4, true) !== 16000 ||
        view.getUint32(start + 8, true) !== 32000 ||
        view.getUint16(start + 12, true) !== 2 ||
        view.getUint16(start + 14, true) !== 16
      )
        invalid();
    }
    if (name === 'data') {
      if (data || length % 2 || length / 2 > 480000) invalid();
      data = true;
    }
    at = next;
  }
  if (!fmt || !data) invalid();
}
export async function parseTurn(
  bytes: Uint8Array,
  contentType: string,
): Promise<TurnInput> {
  if (bytes.byteLength > 2097152)
    throw new AppError(
      413,
      'BODY_TOO_LARGE',
      'Request exceeds 2 MiB.',
      null,
      false,
    );
  let turnId: string | null = null;
  try {
    const type =
      /^multipart\/form-data\s*;\s*boundary=(?:"([^"\r\n]{1,70})"|([A-Za-z0-9()+_,.\/:=?\x27-]{1,70}))\s*$/i.exec(
        contentType,
      );
    if (!type) invalid();
    const boundary = type[1] ?? type[2];
    if (
      boundary.endsWith(' ') ||
      !/^[A-Za-z0-9()+_,.\/:=?\x27 -]+$/.test(boundary)
    )
      invalid();
    const body = bytes.slice().buffer;
    const form = await new Request('http://localhost/', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body,
    }).formData();
    const fields = new Map<string, FormDataEntryValue>();
    for (const [key, value] of form) {
      if (
        !['turnId', 'history', 'text', 'audio'].includes(key) ||
        fields.has(key)
      )
        invalid();
      fields.set(key, value);
    }
    turnId = uuid(fields.get('turnId'));
    const history = validateHistory(JSON.parse(str(fields.get('history'))));
    if (fields.has('text') === fields.has('audio')) invalid();
    if (fields.has('text')) {
      const text = str(fields.get('text'));
      if (!text.trim() || text.length > 2000) invalid();
      return { turnId, history, kind: 'text', text };
    }
    const audio = fields.get('audio');
    if (!(audio instanceof Blob) || audio.type.toLowerCase() !== 'audio/wav')
      invalid();
    const wav = new Uint8Array(await audio.arrayBuffer());
    validateWav(wav);
    return { turnId, history, kind: 'audio', wav };
  } catch (error) {
    if (error instanceof AppError)
      throw new AppError(
        error.httpStatus,
        error.code,
        error.message,
        turnId,
        error.retryable,
      );
    throw new AppError(
      400,
      'INVALID_REQUEST',
      'Invalid request.',
      turnId,
      false,
    );
  }
}
