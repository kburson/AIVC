import { observe } from '../measurements';
export type CaptureToken = Readonly<{
  epoch: number;
  utteranceId: number;
  intentVersion: number;
}>;
export type VadCallbacks = {
  rawStart(capture: CaptureToken): void;
  confirmedStart(capture: CaptureToken): void;
  misfire(capture: CaptureToken): void;
  end(capture: CaptureToken, samples: Float32Array): void;
  frame(samples: Float32Array): void;
};
export type VadHandle = {
  start(): Promise<void>;
  pause(): Promise<void>;
  destroy(): Promise<void>;
};
export const VAD_LIFECYCLE_REVISION = 'aivc-vad-lifecycle-v1';
export const VAD_TIMING = Object.freeze({
  frameSamples: 512,
  frameMs: 32,
  minSpeechMs: 400,
  quantizedMinSpeechMs: 384,
  redemptionMs: 800,
  preSpeechPadMs: 800,
});
let allocationEpoch = 0;
/** Default injected acquisition boundary; each call requests a new microphone stream. */
export function acquireMicrophoneStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
}
export async function createVad(
  context: AudioContext,
  acquireStream: () => Promise<MediaStream>,
  stopStream: (stream: MediaStream) => Promise<void>,
  callbacks: VadCallbacks,
): Promise<VadHandle> {
  const { MicVAD } = await import('@ricky0123/vad-web'); // Module entry, never its CDN bundle.
  if (MicVAD.lifecyclePatchRevision !== VAD_LIFECYCLE_REVISION)
    throw Error('Pinned VAD lifecycle patch is not applied.');
  observe('vad-module', { revision: MicVAD.lifecyclePatchRevision });
  if (!globalThis.location?.origin)
    throw Error('Capture requires a browser origin.');
  const assets = new URL('vad/', globalThis.location.origin);
  const ortAssets = new URL('vad/ort/', globalThis.location.origin);
  const epoch = ++allocationEpoch;
  let lastSpeechFrameAt = 0;
  let utteranceId = 0,
    capture: CaptureToken | null = null,
    phase: 'tentative' | 'confirmed' | null = null;
  const vad = await MicVAD.new({
    audioContext: context,
    startOnLoad: false,
    model: 'v5',
    processorType: 'AudioWorklet',
    baseAssetPath: assets.pathname,
    onnxWASMBasePath: ortAssets.pathname,
    minSpeechMs: 400,
    redemptionMs: 800,
    preSpeechPadMs: 800,
    positiveSpeechThreshold: 0.3,
    negativeSpeechThreshold: 0.25,
    getStream: acquireStream,
    pauseStream: stopStream,
    resumeStream: async () => acquireStream(),
    onSpeechStart: () => {
      lastSpeechFrameAt = performance.now();
      capture = Object.freeze({
        epoch,
        utteranceId: ++utteranceId,
        intentVersion: 0,
      });
      phase = 'tentative';
      callbacks.rawStart(capture);
    },
    onSpeechRealStart: () => {
      if (capture && phase === 'tentative') {
        phase = 'confirmed';
        callbacks.confirmedStart(capture);
      }
    },
    onVADMisfire: () => {
      if (!capture || phase !== 'tentative') return;
      const token = capture;
      capture = null;
      phase = null;
      callbacks.misfire(token);
    },
    onSpeechEnd: (samples) => {
      if (!capture) return;
      const token = capture;
      capture = null;
      phase = null;
      const endCallbackAt = performance.now();
      observe('vad-frame-end', {
        vadEpoch: token.epoch,
        vadUtteranceId: token.utteranceId,
        lastSpeechFrameAt,
        vadEndDelayMs: Math.max(0, endCallbackAt - lastSpeechFrameAt),
      });
      callbacks.end(token, samples);
    },
    onFrameProcessed: (probs, samples) => {
      if (probs.isSpeech >= 0.25) lastSpeechFrameAt = performance.now();
      callbacks.frame(samples);
    },
  });
  const pause = vad.pause,
    destroy = vad.destroy;
  vad.pause = () => {
    capture = null;
    phase = null;
    return pause();
  };
  vad.destroy = () => {
    capture = null;
    phase = null;
    return destroy();
  };
  return vad;
}
