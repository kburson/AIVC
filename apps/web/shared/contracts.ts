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
export type HistoryMessage = { role: 'user' | 'assistant'; content: string };
export type TurnInput = { turnId: string; history: HistoryMessage[] } & (
  { kind: 'text'; text: string } | { kind: 'audio'; wav: Uint8Array }
);
export type SpeechInput = { turnId: string; segmentId: string; text: string };
export type Source = { title: string; url: string; citedText?: string };
export type Usage = {
  inputTokens?: number;
  outputTokens?: number;
  searchUses?: number;
};
export type AppErrorFields = {
  code: string;
  message: string;
  turnId: string | null;
  retryable: boolean;
};
export type TurnStatus =
  'complete' | 'interrupted' | 'failed' | 'truncated' | 'no-speech';
export type EventPayloads = {
  'turn.accepted': { mode: 'live' | 'mock' };
  'transcript.final': { text: string };
  stage: { stage: 'transcribing' | 'researching' | 'retrieving' | 'answering' };
  'tool.started': { name: 'lookup_projects'; summary: string };
  'tool.completed': { result: ProjectCatalog };
  'answer.delta': { text: string };
  sources: { sources: Source[] };
  'turn.completed': {
    text: string;
    status: 'complete' | 'truncated' | 'no-speech';
    usage?: Usage;
  };
  'turn.failed': AppErrorFields;
};
export type TurnEvent = {
  [K in keyof EventPayloads]: {
    schemaVersion: 1;
    turnId: string;
    seq: number;
    type: K;
    data: EventPayloads[K];
  };
}[keyof EventPayloads];
export type Capabilities = {
  schemaVersion: 1;
  mode: 'live' | 'mock';
  model: string | null;
  sttModel: string | null;
  ttsModel: string | null;
  build: { mode: 'production' | 'development'; buildId: string | null };
  turnsAvailable: boolean;
  speechAvailable: boolean;
  search: {
    state: 'disabled' | 'unavailable' | 'configured' | 'verified';
    reason: string | null;
    accountValidation: 'pending' | 'verified' | 'unavailable';
  };
  speech: {
    segmentChars: number;
    backlogChars: 2400;
    highWaterSeconds: 10;
    lowWaterSeconds: 2;
  };
};
export class AppError extends Error {
  constructor(
    readonly httpStatus: number,
    readonly code: string,
    message: string,
    readonly turnId: string | null,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
