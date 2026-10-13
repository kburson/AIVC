import { AppError } from '../shared/contracts';
export type ServerConfig = {
  mode: 'live' | 'mock';
  allowedOrigins: ReadonlySet<string>;
  allowedHosts: ReadonlySet<string>;
  anthropicKey: string | null;
  claudeModel: string | null;
  deepgramKey: string | null;
  sttModel: string | null;
  ttsModel: string | null;
  retrievalBaseUrl: string;
  searchEnabled: boolean;
  searchToolVersion: 'web_search_20250305';
  speechCharsPerSecond: number;
  segmentChars: number;
  turnTimeoutMs: number;
  retrievalTimeoutMs: number;
  speechTimeoutMs: number;
};
function invalid(name: string): never {
  throw new AppError(
    400,
    'INVALID_REQUEST',
    'Invalid server configuration: ' + name + '.',
    null,
    false,
  );
}
function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) invalid(name);
  return value;
}
function origin(value: string, name: string): URL {
  try {
    const parsed = new URL(value);
    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      parsed.origin !== value ||
      value.includes('*')
    )
      invalid(name);
    return parsed;
  } catch {
    return invalid(name);
  }
}
function list(env: NodeJS.ProcessEnv, name: string): string[] {
  const values = required(env, name)
    .split(',')
    .map((value) => value.trim());
  if (values.some((value) => !value)) invalid(name);
  return values;
}
function number(env: NodeJS.ProcessEnv, name: string, timer = false): number {
  const value = Number(required(env, name));
  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    (timer && (!Number.isSafeInteger(value) || value > 2147483647))
  )
    invalid(name);
  return value;
}
export function loadConfig(env: NodeJS.ProcessEnv): ServerConfig {
  const mode = env.AIVC_MODE ?? 'live';
  if (mode !== 'live' && mode !== 'mock') invalid('AIVC_MODE');
  const hosts = list(env, 'BFF_ALLOWED_HOSTS');
  for (const host of hosts) {
    const parsed = origin('http://' + host, 'BFF_ALLOWED_HOSTS');
    if (parsed.host !== host) invalid('BFF_ALLOWED_HOSTS');
  }
  const allowedHosts = new Set(hosts);
  const origins = list(env, 'BFF_ALLOWED_ORIGINS');
  for (const value of origins) {
    if (!allowedHosts.has(origin(value, 'BFF_ALLOWED_ORIGINS').host))
      invalid('BFF_ALLOWED_ORIGINS');
  }
  const speechCharsPerSecond = number(env, 'SPEECH_CHARS_PER_SECOND');
  const segmentChars = Math.min(120, Math.floor(6 * speechCharsPerSecond));
  if (segmentChars < 1) invalid('SPEECH_CHARS_PER_SECOND');
  const search = env.CLAUDE_WEB_SEARCH ?? 'enabled';
  if (search !== 'enabled' && search !== 'disabled')
    invalid('CLAUDE_WEB_SEARCH');
  const searchToolVersion =
    env.CLAUDE_WEB_SEARCH_TOOL_VERSION ?? 'web_search_20250305';
  if (searchToolVersion !== 'web_search_20250305')
    invalid('CLAUDE_WEB_SEARCH_TOOL_VERSION');
  const retrievalBaseUrl = required(env, 'RETRIEVAL_BASE_URL');
  origin(retrievalBaseUrl, 'RETRIEVAL_BASE_URL');
  const optional = (name: string) => env[name]?.trim() || null;
  return {
    mode,
    allowedOrigins: new Set(origins),
    allowedHosts,
    anthropicKey: optional('ANTHROPIC_API_KEY'),
    claudeModel: optional('CLAUDE_MODEL'),
    deepgramKey: optional('DEEPGRAM_API_KEY'),
    sttModel: optional('DEEPGRAM_STT_MODEL'),
    ttsModel: optional('DEEPGRAM_TTS_MODEL'),
    retrievalBaseUrl,
    searchEnabled: search === 'enabled',
    searchToolVersion,
    speechCharsPerSecond,
    segmentChars,
    turnTimeoutMs: number(env, 'TURN_TIMEOUT_MS', true),
    retrievalTimeoutMs: number(env, 'RETRIEVAL_TIMEOUT_MS', true),
    speechTimeoutMs: number(env, 'SPEECH_TIMEOUT_MS', true),
  };
}
