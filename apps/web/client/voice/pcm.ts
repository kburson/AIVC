/** Streaming mono signed PCM16 little endian, normalized to Web Audio floats. */
export class PcmDecoder {
  private pending: number | null = null;
  push(bytes: Uint8Array): Float32Array {
    const output = new Float32Array(
      Math.floor((bytes.length + (this.pending === null ? 0 : 1)) / 2),
    );
    let input = 0,
      written = 0;
    if (this.pending !== null && bytes.length) {
      const word = this.pending | (bytes[input++] << 8);
      output[written++] = (word >= 32768 ? word - 65536 : word) / 32768;
      this.pending = null;
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    while (input + 1 < bytes.length) {
      output[written++] = view.getInt16(input, true) / 32768;
      input += 2;
    }
    if (input < bytes.length) this.pending = bytes[input];
    return output;
  }
  finish(): void {
    if (this.pending !== null)
      throw new Error('INVALID_PCM: incomplete final sample');
  }
}
