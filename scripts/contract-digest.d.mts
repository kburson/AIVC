/** SHA-256 of the closed eight-file public contract source set, with raw path/NUL/decimal byteLength/NUL/bytes/NUL framing. */
export function computeContractDigest(
  read: (path: string) => Uint8Array,
): string;
