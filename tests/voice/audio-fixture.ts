import type { TurnToken } from '../../apps/web/client/turn-controller';
export const token: TurnToken = {
  generation: 1,
  turnId: '11111111-1111-4111-8111-111111111111',
};
export class AudioClock {
  currentTime = 0;
  sampleRate = 48000;
  state: AudioContextState = 'running';
  destination = {};
  buffers: Array<{ sampleRate: number; length: number; data: Float32Array }> =
    [];
  sources: Array<{
    buffer: AudioBuffer | null;
    startAt: number;
    stopped: boolean;
    onended: (() => void) | null;
    connect: () => void;
    disconnect: () => void;
    start: (time: number) => void;
    stop: () => void;
  }> = [];
  resumeGate: Promise<void> | null = null;
  suspendGate: Promise<void> | null = null;
  resumes = 0;
  suspends = 0;
  closed = false;
  createBuffer(_channels: number, length: number, sampleRate: number) {
    const data = new Float32Array(length);
    this.buffers.push({ sampleRate, length, data });
    return {
      numberOfChannels: 1,
      getChannelData: () => data,
      copyFromChannel: (target: Float32Array) =>
        target.set(data.subarray(0, target.length)),
      duration: length / sampleRate,
      length,
      sampleRate,
      copyToChannel: (input: Float32Array) => data.set(input),
    } as AudioBuffer;
  }
  createBufferSource() {
    const source = {
      buffer: null as AudioBuffer | null,
      startAt: 0,
      stopped: false,
      onended: null as (() => void) | null,
      connect() {},
      disconnect() {},
      start(time: number) {
        this.startAt = time;
      },
      stop() {
        this.stopped = true;
      },
    };
    this.sources.push(source);
    return source as unknown as AudioBufferSourceNode;
  }
  async resume() {
    this.resumes++;
    await this.resumeGate;
    this.state = 'running';
  }
  async suspend() {
    this.suspends++;
    await this.suspendGate;
    this.state = 'suspended';
  }
  async close() {
    this.closed = true;
    this.state = 'closed';
  }
  context() {
    return this as unknown as AudioContext;
  }
}
export function pcm(seconds: number) {
  return new Uint8Array(Math.round(seconds * 24000) * 2);
}
export function speechResponse(bytes: Uint8Array | ReadableStream<Uint8Array>) {
  return new Response(bytes as BodyInit, {
    headers: {
      'content-type': 'application/octet-stream',
      'x-audio-encoding': 'pcm_s16le',
      'x-audio-sample-rate': '24000',
      'x-audio-channels': '1',
    },
  });
}
export async function settle() {
  for (let i = 0; i < 20; i++) await Promise.resolve();
}
