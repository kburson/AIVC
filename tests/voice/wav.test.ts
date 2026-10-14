import { describe, expect, it } from 'vitest';
import { encodeWav } from '../../apps/web/client/voice/wav';
import { parseTurn } from '../../apps/web/shared/validation';

async function multipart(wav: Blob) {
  const form = new FormData();
  form.set('turnId', '11111111-1111-4111-8111-111111111111');
  form.set('history', '[]');
  form.set('audio', wav, 'capture.wav');
  const request = new Request('http://localhost/api/turn', {
    method: 'POST',
    body: form,
  });
  return parseTurn(
    new Uint8Array(await request.arrayBuffer()),
    request.headers.get('content-type')!,
  );
}
describe('PCM16 WAV capture', () => {
  it('writes literal RIFF44/mono16kHz/little-endian/clipping and asymmetric rounding', async () => {
    const wav = encodeWav(new Float32Array([-2, -1, -0.5, 0, 0.5, 1, 2]));
    expect(wav.type).toBe('audio/wav');
    const bytes = new Uint8Array(await wav.arrayBuffer());
    const view = new DataView(bytes.buffer);
    expect(bytes.length).toBe(58);
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('RIFF');
    expect(new TextDecoder().decode(bytes.slice(8, 16))).toBe('WAVEfmt ');
    expect(new TextDecoder().decode(bytes.slice(36, 40))).toBe('data');
    expect([
      view.getUint32(4, true),
      view.getUint32(16, true),
      view.getUint16(20, true),
      view.getUint16(22, true),
      view.getUint32(24, true),
      view.getUint32(28, true),
      view.getUint16(32, true),
      view.getUint16(34, true),
      view.getUint32(40, true),
    ]).toEqual([50, 16, 1, 1, 16000, 32000, 2, 16, 14]);
    expect(
      Array.from({ length: 7 }, (_, i) => view.getInt16(44 + i * 2, true)),
    ).toEqual([-32768, -32768, -16384, 0, 16384, 32767, 32767]);
    expect(Array.from(bytes.slice(44, 48))).toEqual([0, 128, 0, 128]);
    expect((await multipart(wav)).kind).toBe('audio');
  });
  it('rounds a fractional positive PCM step instead of truncating', async () => {
    const view = new DataView(
      await encodeWav(
        new Float32Array([0.75 / 32767, -0.75 / 32768]),
      ).arrayBuffer(),
    );
    expect([view.getInt16(44, true), view.getInt16(46, true)]).toEqual([1, -1]);
  });
  it('accepts a measured 30-second utterance through the frozen multipart parser', async () => {
    const wav = encodeWav(new Float32Array(480000).fill(0.25));
    expect(wav.size).toBe(960044);
    const parsed = await multipart(wav);
    expect(parsed.kind).toBe('audio');
    if (parsed.kind === 'audio') expect(parsed.wav.length).toBe(960044);
  });
  it.each([
    new Float32Array(),
    new Float32Array(480001),
    new Float32Array([NaN]),
    new Float32Array([Infinity]),
  ])(
    'rejects empty, excess or malformed normalized samples without producing a submission',
    (samples) => {
      expect(() => encodeWav(samples)).toThrow(RangeError);
    },
  );
  it('frozen parser rejects a corrupt header independently of the encoder', async () => {
    const bytes = new Uint8Array(
      await encodeWav(new Float32Array([0.25])).arrayBuffer(),
    );
    bytes[24] = 1;
    await expect(
      multipart(new Blob([bytes], { type: 'audio/wav' })),
    ).rejects.toMatchObject({ code: 'INVALID_REQUEST' });
  });
});
