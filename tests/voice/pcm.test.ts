import { expect, it } from 'vitest';
import { PcmDecoder } from '../../apps/web/client/voice/pcm';
it('keeps a half sample across chunks and uses signed little endian', () => {
  const d = new PcmDecoder();
  expect([...d.push(Uint8Array.of(0))]).toEqual([]);
  expect([...d.push(Uint8Array.of(128, 255, 127))]).toEqual([
    -1,
    32767 / 32768,
  ]);
  d.finish();
});
it('decodes arbitrary chunks exactly once including offset views and zero', () => {
  const bytes = Uint8Array.of(9, 0, 128, 0, 0, 255, 127, 255, 255, 9).subarray(
    1,
    9,
  );
  for (let size = 1; size <= 8; size++) {
    const d = new PcmDecoder();
    const output: number[] = [];
    for (let n = 0; n < bytes.length; n += size)
      output.push(...d.push(bytes.subarray(n, n + size)));
    d.finish();
    expect(output).toEqual([-1, 0, 32767 / 32768, -1 / 32768]);
  }
});
it('rejects an odd final byte without inventing a sample', () => {
  const d = new PcmDecoder();
  d.push(Uint8Array.of(1));
  expect(() => d.finish()).toThrow(/PCM/);
});
