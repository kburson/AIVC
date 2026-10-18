/** Non-secret protocol settings shared by eligible web and core instances. */
export interface InterfacePolicy {
  readonly contractVersion: 1;
  readonly turnTimeoutMs: number;
  readonly speechTimeoutMs: number;
  readonly transportGraceMs: number;
  readonly turnBodyLimitBytes: 2097152;
  readonly speechBodyLimitBytes: 8192;
  readonly textLimitChars: 2000;
  readonly historyMessageLimit: 8;
  readonly historyLimitChars: 16000;
  readonly segmentChars: number;
}

const fields = [
  'contractVersion',
  'turnTimeoutMs',
  'speechTimeoutMs',
  'transportGraceMs',
  'turnBodyLimitBytes',
  'speechBodyLimitBytes',
  'textLimitChars',
  'historyMessageLimit',
  'historyLimitChars',
  'segmentChars',
] as const;
const positiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

export function validateInterfacePolicy(
  value: unknown,
  expectedSegmentChars: number,
): InterfacePolicy {
  const invalid = () => new TypeError('Invalid interface policy.');
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw invalid();
  const input = value as Record<string, unknown>;
  if (
    Reflect.ownKeys(input).length !== fields.length ||
    fields.some((key) => !Object.hasOwn(input, key))
  )
    throw invalid();
  const { turnTimeoutMs, speechTimeoutMs, transportGraceMs, segmentChars } =
    input;
  if (
    !positiveInteger(turnTimeoutMs) ||
    !positiveInteger(speechTimeoutMs) ||
    !positiveInteger(transportGraceMs)
  )
    throw invalid();
  if (
    !Number.isSafeInteger(turnTimeoutMs + transportGraceMs) ||
    !Number.isSafeInteger(speechTimeoutMs + transportGraceMs)
  )
    throw invalid();
  if (
    input.contractVersion !== 1 ||
    input.turnBodyLimitBytes !== 2097152 ||
    input.speechBodyLimitBytes !== 8192 ||
    input.textLimitChars !== 2000 ||
    input.historyMessageLimit !== 8 ||
    input.historyLimitChars !== 16000
  )
    throw invalid();
  if (
    !positiveInteger(expectedSegmentChars) ||
    expectedSegmentChars > 120 ||
    segmentChars !== expectedSegmentChars
  )
    throw invalid();
  // Explicit order is the canonical byte contract, independent of input insertion order.
  return {
    contractVersion: 1,
    turnTimeoutMs,
    speechTimeoutMs,
    transportGraceMs,
    turnBodyLimitBytes: 2097152,
    speechBodyLimitBytes: 8192,
    textLimitChars: 2000,
    historyMessageLimit: 8,
    historyLimitChars: 16000,
    segmentChars: expectedSegmentChars,
  };
}

export function encodeInterfacePolicy(
  value: unknown,
  expectedSegmentChars: number,
): Uint8Array {
  return new TextEncoder().encode(
    JSON.stringify(validateInterfacePolicy(value, expectedSegmentChars)),
  );
}
