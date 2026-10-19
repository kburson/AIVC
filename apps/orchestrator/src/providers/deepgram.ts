import { DeepgramClient } from '@deepgram/sdk';
import type { ServerConfig } from '../config.js';
import type { SpeechAdapter } from './contracts.js';
import { AppError } from '@aivc/contracts';
import { deadlineRemainingMs } from '../turns/deadline.js';
export function isExpectedPcmMime(value: string): boolean {
  const parts = value.split(';');
  if (parts.shift()?.trim().toLowerCase() !== 'audio/l16') return false;
  const names = new Set<string>();
  for (const part of parts) {
    const m =
      /^\s*([!#$%&'*+.^_`|~\w-]+)\s*=\s*(?:([!#$%&'*+.^_`|~\w-]+)|"([^"\\\r\n]*)")\s*$/.exec(
        part,
      );
    if (!m) return false;
    const name = m[1].toLowerCase(),
      val = m[2] ?? m[3];
    if (names.has(name)) return false;
    names.add(name);
    if (
      (name === 'rate' && val !== '24000') ||
      (name === 'channels' && val !== '1')
    )
      return false;
  }
  return true;
}
function failure(
  error: unknown,
  code: string,
  turnId: string | null,
): AppError {
  if (error instanceof AppError) return error;
  const rate =
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    error.statusCode === 429;
  return new AppError(
    rate ? 429 : 502,
    rate ? 'RATE_LIMITED' : code,
    rate
      ? 'Speech provider rate limit reached.'
      : code === 'STT_FAILED'
        ? 'Transcription failed.'
        : 'Speech provider returned invalid audio.',
    turnId,
    false,
  );
}
export function createDeepgramAdapter(
  config: ServerConfig,
  fetchImpl?: typeof fetch,
): SpeechAdapter {
  const client = new DeepgramClient({
    apiKey: config.deepgramKey ?? '',
    maxRetries: 0,
    fetch: fetchImpl,
  });
  const options = (signal: AbortSignal, ms: number) => ({
    abortSignal: signal,
    maxRetries: 0,
    timeoutInSeconds: Math.max(
      0.001,
      Math.min(ms, deadlineRemainingMs(signal)) / 1000,
    ),
  });
  return {
    async transcribe(wav, signal) {
      signal.throwIfAborted();
      try {
        if (!config.deepgramKey || !config.sttModel)
          throw failure(null, 'STT_FAILED', null);
        const response: unknown = await client.listen.v1.media.transcribeFile(
          new Blob([wav.slice().buffer], { type: 'audio/wav' }),
          { model: config.sttModel },
          options(signal, config.turnTimeoutMs),
        );
        signal.throwIfAborted();
        const result = response as {
          results?: {
            channels?: Array<{
              alternatives?: Array<{ transcript?: unknown }>;
            }>;
          };
        } | null;
        const transcript =
          result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
        if (typeof transcript !== 'string')
          throw failure(null, 'STT_FAILED', null);
        return transcript.trim();
      } catch (error) {
        signal.throwIfAborted();
        throw failure(error, 'STT_FAILED', null);
      }
    },
    async synthesize(input, signal) {
      signal.throwIfAborted();
      try {
        if (!config.deepgramKey || !config.ttsModel)
          throw failure(null, 'SPEECH_FAILED', input.turnId);
        const { data, rawResponse } = await client.speak.v1.audio
          .generate(
            {
              text: input.text,
              model: config.ttsModel,
              encoding: 'linear16',
              sample_rate: 24000,
              container: 'none',
            },
            options(signal, config.speechTimeoutMs),
          )
          .withRawResponse();
        const stream = data.stream();
        if (
          signal.aborted ||
          !stream ||
          !isExpectedPcmMime(rawResponse.headers.get('content-type') ?? '')
        ) {
          await stream?.cancel().catch(() => {});
          signal.throwIfAborted();
          throw failure(null, 'SPEECH_FAILED', input.turnId);
        }
        return {
          stream,
          format: { encoding: 'pcm_s16le', sampleRate: 24000, channels: 1 },
        };
      } catch (error) {
        signal.throwIfAborted();
        throw failure(error, 'SPEECH_FAILED', input.turnId);
      }
    },
  };
}
