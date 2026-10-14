const MAX_SAMPLES = 480000;
export function encodeWav(samples: Float32Array): Blob {
  if (
    !samples.length ||
    samples.length > MAX_SAMPLES ||
    samples.some((sample) => !Number.isFinite(sample))
  )
    throw new RangeError(
      'Capture requires 1–480000 finite normalized samples.',
    );
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const label = (at: number, value: string) => {
    for (let i = 0; i < value.length; i++)
      view.setUint8(at + i, value.charCodeAt(i));
  };
  label(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  label(8, 'WAVE');
  label(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(
      44 + i * 2,
      Math.round(sample * (sample < 0 ? 32768 : 32767)),
      true,
    );
  }
  return new Blob([bytes], { type: 'audio/wav' });
}
