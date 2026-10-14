// Browser-only controlled VAD boundary. Product capture/controller/queue/playback/Conversation stay real.
import type {
  CaptureToken,
  VadCallbacks,
} from '../../apps/web/client/voice/vad-adapter';
type Scheduled = { turn: number; stopped: boolean; length: number };
type Driver = {
  raw(): number;
  confirm(id: number): void;
  misfire(id: number): void;
  end(id: number): void;
  delaySuspend: boolean;
  releaseSuspend(): void;
  rawAt: number[];
  silenceAt: number[];
  confirmAt: number[];
  sources: Scheduled[];
  settings: { mode: string; headset: string; speaker: string };
};
declare global {
  interface Window {
    interruptionSimulation: Driver;
  }
}
let callbacks: VadCallbacks, stream: MediaStream;
const tokens = new Map<number, CaptureToken>();
let next = 0;
export async function acquireMicrophoneStream() {
  return stream;
}
export async function createVad(
  context: AudioContext,
  acquire: () => Promise<MediaStream>,
  stop: (stream: MediaStream) => Promise<void>,
  cb: VadCallbacks,
) {
  callbacks = cb;
  stream = context.createMediaStreamDestination().stream;
  const owned = await acquire();
  return {
    start: async () => {},
    pause: async () => {},
    destroy: async () => {
      await stop(owned);
    },
  };
}
export function installInterruptionDriver() {
  let release = () => {};
  const driver: Driver = {
    raw() {
      const id = ++next,
        token = Object.freeze({ epoch: 50, utteranceId: id, intentVersion: 0 });
      tokens.set(id, token);
      driver.rawAt.push(performance.now());
      callbacks.rawStart(token);
      return id;
    },
    confirm(id) {
      driver.confirmAt.push(performance.now());
      callbacks.confirmedStart(tokens.get(id)!);
    },
    misfire(id) {
      callbacks.misfire(tokens.get(id)!);
    },
    end(id) {
      callbacks.end(tokens.get(id)!, new Float32Array(1600));
    },
    delaySuspend: false,
    releaseSuspend() {
      release();
    },
    rawAt: [],
    silenceAt: [],
    confirmAt: [],
    sources: [],
    settings: {
      mode: 'Mock/Contract Simulation: controlled VAD and transport; real browser audio scheduling',
      headset:
        'Default 0.3/0.25 thresholds; 400ms confirmation; 800ms redemption/pre-roll',
      speaker:
        'Echo/noise/gain constraints requested in real capture; physical self-trigger/echo acceptance remains #11',
    },
  };
  window.interruptionSimulation = driver;
  const suspend = AudioContext.prototype.suspend;
  AudioContext.prototype.suspend = async function () {
    if (driver.delaySuspend)
      await new Promise<void>((r) => {
        release = r;
      });
    await suspend.call(this);
    driver.silenceAt.push(performance.now());
  };
  const source = AudioContext.prototype.createBufferSource;
  AudioContext.prototype.createBufferSource = function () {
    const node = source.call(this),
      start = node.start.bind(node),
      stop = node.stop.bind(node);
    let record: Scheduled | undefined;
    node.start = (...args) => {
      record = {
        turn: window.__aivcHarness.calls.length,
        stopped: false,
        length: node.buffer?.length ?? 0,
      };
      driver.sources.push(record);
      start(...args);
    };
    node.stop = (...args) => {
      // Each node owns its record, including after a newer request starts.
      if (record) record.stopped = true;
      stop(...args);
    };
    return node;
  };
}
