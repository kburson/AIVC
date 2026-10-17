import { describe, expect, it } from 'vitest';
import * as api from '@aivc/contracts';

const policy = {
  contractVersion: 1,
  turnTimeoutMs: 60000,
  speechTimeoutMs: 10000,
  transportGraceMs: 5000,
  turnBodyLimitBytes: 2097152,
  speechBodyLimitBytes: 8192,
  textLimitChars: 2000,
  historyMessageLimit: 8,
  historyLimitChars: 16000,
  segmentChars: 120,
};
function validate(value: unknown, expected = 120) {
  expect(api.validateInterfacePolicy).toBeTypeOf('function');
  return api.validateInterfacePolicy(value, expected);
}

describe('closed non-secret interface policy', () => {
  it('accepts and normalizes an explicit policy paired to service segment configuration', () => {
    expect(validate(policy)).toEqual(policy);
    expect(validate({ ...policy, segmentChars: 80 }, 80).segmentChars).toBe(80);
  });
  it.each(Object.keys(policy))('refuses missing field %s', (key) => {
    const value: Record<string, unknown> = { ...policy };
    delete value[key];
    expect(() => validate(value)).toThrow(TypeError);
  });
  it.each([
    null,
    [],
    true,
    'policy',
    { ...policy, token: 'fixture' },
    { ...policy, extra: 1 },
  ])(
    'refuses nonobjects and unknown secret or ordinary fields: %#',
    (value) => {
      expect(() => validate(value)).toThrow(TypeError);
    },
  );
  it.each(['turnTimeoutMs', 'speechTimeoutMs', 'transportGraceMs'])(
    'requires finite positive safe integer %s',
    (key) => {
      for (const value of [
        0,
        -1,
        1.5,
        Infinity,
        NaN,
        Number.MAX_SAFE_INTEGER + 1,
        '5000',
      ]) {
        expect(() => validate({ ...policy, [key]: value })).toThrow(TypeError);
      }
    },
  );
  it.each([
    ['contractVersion', 2],
    ['turnBodyLimitBytes', 2097153],
    ['speechBodyLimitBytes', 8193],
    ['textLimitChars', 2001],
    ['historyMessageLimit', 10],
    ['historyLimitChars', 16001],
  ])('refuses drifting contract bound %s', (key, value) => {
    expect(() => validate({ ...policy, [key]: value })).toThrow(TypeError);
    expect(() =>
      validate({
        ...policy,
        [key]: String(policy[key as keyof typeof policy]),
      }),
    ).toThrow(TypeError);
  });
  it.each([0, -1, 121, 1.5, NaN, Infinity])(
    'refuses invalid segment cap %s',
    (segmentChars) => {
      expect(() => validate({ ...policy, segmentChars }, segmentChars)).toThrow(
        TypeError,
      );
      expect(() => validate(policy, segmentChars)).toThrow(TypeError);
    },
  );
  it('rejects a policy whose speech bound differs from the separately configured service bound', () => {
    expect(() => validate({ ...policy, segmentChars: 80 }, 120)).toThrow(
      TypeError,
    );
    expect(() => validate(policy, 80)).toThrow(TypeError);
  });
  it('keeps timeout plus transport grace inside safe integer arithmetic', () => {
    expect(() =>
      validate({ ...policy, turnTimeoutMs: Number.MAX_SAFE_INTEGER }),
    ).toThrow(TypeError);
    expect(() =>
      validate({ ...policy, speechTimeoutMs: Number.MAX_SAFE_INTEGER }),
    ).toThrow(TypeError);
  });
  it('canonicalizes property order into exact UTF-8 bytes without Node hashing', () => {
    expect(api.encodeInterfacePolicy).toBeTypeOf('function');
    const reversed = Object.fromEntries(Object.entries(policy).reverse());
    const encoded = api.encodeInterfacePolicy(reversed, 120);
    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder('utf-8', { fatal: true }).decode(encoded)).toBe(
      '{"contractVersion":1,"turnTimeoutMs":60000,"speechTimeoutMs":10000,"transportGraceMs":5000,"turnBodyLimitBytes":2097152,"speechBodyLimitBytes":8192,"textLimitChars":2000,"historyMessageLimit":8,"historyLimitChars":16000,"segmentChars":120}',
    );
    expect(api.encodeInterfacePolicy(policy, 120)).toEqual(encoded);
  });
  it('validates before canonical encoding instead of silently dropping unknown fields', () => {
    expect(api.encodeInterfacePolicy).toBeTypeOf('function');
    expect(() =>
      api.encodeInterfacePolicy({ ...policy, unexpected: 1 }, 120),
    ).toThrow(TypeError);
  });
});
