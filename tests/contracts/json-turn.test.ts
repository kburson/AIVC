import { describe, expect, it } from 'vitest';
import * as api from '@aivc/contracts';
import { wireTurnId } from '../helpers/wire-contract-fixtures';

const encoder = new TextEncoder();
const input = { turnId: wireTurnId, history: [], text: 'hello café 🌊' };
const normalized = {
  turnId: wireTurnId,
  history: [],
  kind: 'text',
  text: 'hello café 🌊',
};
const json = (value: unknown) => encoder.encode(JSON.stringify(value));
const strict = (text: string) => {
  expect(api.parseStrictJson).toBeTypeOf('function');
  return api.parseStrictJson(encoder.encode(text));
};

describe('bounded portable JSON text turns', () => {
  it.each([
    'application/json',
    'application/json; charset=utf-8',
    'Application/JSON; Charset="UTF-8"',
  ])('normalizes %s through the public parser', async (type) => {
    await expect(api.parseTurn(json(input), type)).resolves.toEqual(normalized);
  });

  it('gives multipart and JSON the same independently specified normalized input', async () => {
    const form = new FormData();
    form.set('turnId', wireTurnId);
    form.set('history', '[]');
    form.set('text', input.text);
    const request = new Request('http://fixture.invalid/', {
      method: 'POST',
      body: form,
    });
    const bytes = new Uint8Array(await request.arrayBuffer());
    await expect(
      api.parseTurn(bytes, request.headers.get('content-type')!),
    ).resolves.toEqual(normalized);
    await expect(
      api.parseTurn(json(input), 'application/json'),
    ).resolves.toEqual(normalized);
  });

  it.each([
    'text/json',
    'application/json; charset=utf-16',
    'application/json; charset=latin1',
    'application/json; boundary=x',
    'application/json; charset=utf-8; extra=x',
    'application/json; charset=utf-8; charset=utf-8',
    'application/json;',
  ])('refuses unsupported or ambiguous media parameters: %s', async (type) => {
    await expect(api.parseTurn(json(input), type)).rejects.toMatchObject({
      httpStatus: 400,
      code: 'INVALID_REQUEST',
      retryable: false,
    });
  });

  it.each([
    null,
    [],
    'text',
    1,
    { ...input, text: '' },
    { ...input, text: ' '.repeat(10) },
    { ...input, text: 'x'.repeat(2001) },
    { ...input, text: 1 },
    { ...input, turnId: 'not-a-uuid' },
    { history: [], text: 'hello' },
    { turnId: wireTurnId, text: 'hello' },
    { turnId: wireTurnId, history: [] },
    { ...input, history: '[]' },
    { ...input, history: [{ role: 'user', content: 'unpaired' }] },
    {
      ...input,
      history: [
        { role: 'assistant', content: 'wrong' },
        { role: 'user', content: 'order' },
      ],
    },
    {
      ...input,
      history: [
        { role: 'user', content: 'x', extra: true },
        { role: 'assistant', content: 'y' },
      ],
    },
    { ...input, audio: 'base64' },
    { ...input, wav: [] },
    { ...input, extra: true },
    { turnId: wireTurnId, history: [], audio: 'base64' },
  ])(
    'rejects malformed or extra members without introducing another representation: %#',
    async (value) => {
      await expect(
        api.parseTurn(json(value), 'application/json'),
      ).rejects.toMatchObject({
        httpStatus: 400,
        code: 'INVALID_REQUEST',
        retryable: false,
      });
    },
  );

  it('retains exact text, whole-pair count and total history boundaries', async () => {
    const history = Array.from({ length: 8 }, (_, i) => ({
      role: i % 2 ? 'assistant' : 'user',
      content: 'h'.repeat(2000),
    }));
    const bounded = { ...input, history, text: 't'.repeat(2000) };
    await expect(
      api.parseTurn(json(bounded), 'application/json'),
    ).resolves.toEqual({
      turnId: wireTurnId,
      history,
      text: 't'.repeat(2000),
      kind: 'text',
    });
    const longer = history.map((m, i) => ({
      ...m,
      content: m.content + (i ? '' : 'x'),
    }));
    for (const invalidHistory of [
      longer,
      [
        ...history,
        { role: 'user', content: '' },
        { role: 'assistant', content: '' },
      ],
    ]) {
      await expect(
        api.parseTurn(
          json({ ...input, history: invalidHistory }),
          'application/json',
        ),
      ).rejects.toMatchObject({ httpStatus: 400, code: 'INVALID_REQUEST' });
    }
  });

  it('applies the 2 MiB cap to the entire UTF-8 JSON body including whitespace', async () => {
    const bytes = json(input);
    const body = new Uint8Array(2097152).fill(32);
    body.set(bytes);
    await expect(api.parseTurn(body, 'application/json')).resolves.toEqual(
      normalized,
    );
    const oversized = new Uint8Array(2097153).fill(32);
    oversized.set(bytes);
    await expect(
      api.parseTurn(oversized, 'application/json'),
    ).rejects.toMatchObject({
      httpStatus: 413,
      code: 'BODY_TOO_LARGE',
      retryable: false,
    });
  });

  it.each([
    String.raw`{"turnId":"11111111-1111-4111-8111-111111111111","turnId":"11111111-1111-4111-8111-111111111111","history":[],"text":"x"}`,
    String.raw`{"turnId":"11111111-1111-4111-8111-111111111111","\u0074urnId":"11111111-1111-4111-8111-111111111111","history":[],"text":"x"}`,
    String.raw`{"turnId":"11111111-1111-4111-8111-111111111111","history":[{"role":"user","content":"old","con\u0074ent":"new"},{"role":"assistant","content":"ok"}],"text":"x"}`,
  ])(
    'rejects duplicate decoded keys before ordinary JSON.parse can erase them: %#',
    async (text) => {
      await expect(
        api.parseTurn(encoder.encode(text), 'application/json'),
      ).rejects.toMatchObject({
        httpStatus: 400,
        code: 'INVALID_REQUEST',
      });
    },
  );

  it('permits the same keys in distinct history objects and punctuation inside text strings', async () => {
    const value = {
      ...input,
      text: 'literal { "x": 1, "x": 2 }, [] and "escaped"',
      history: [
        { role: 'user', content: 'one' },
        { role: 'assistant', content: 'two' },
      ],
    };
    await expect(
      api.parseTurn(json(value), 'application/json'),
    ).resolves.toEqual({
      turnId: wireTurnId,
      kind: 'text',
      text: value.text,
      history: value.history,
    });
  });

  it('refuses malformed UTF-8 instead of silently replacing it', async () => {
    const prefix = encoder.encode(
      '{"turnId":"' + wireTurnId + '","history":[],"text":"',
    );
    const suffix = encoder.encode('"}');
    const bytes = new Uint8Array(prefix.length + 1 + suffix.length);
    bytes.set(prefix);
    bytes[prefix.length] = 255;
    bytes.set(suffix, prefix.length + 1);
    await expect(
      api.parseTurn(bytes, 'application/json'),
    ).rejects.toMatchObject({
      httpStatus: 400,
      code: 'INVALID_REQUEST',
    });
  });

  it.each([
    '{',
    '{"a":1,}',
    '{"a":undefined}',
    '{"a":"unterminated}',
    'true false',
  ])('retains JSON.parse syntax rejection: %s', (text) => {
    expect(() => strict(text)).toThrow(api.AppError);
  });
});

describe('browser-safe lexical JSON preflight', () => {
  it('bounds both object and array nesting at 16 before parsing', () => {
    expect(() =>
      strict('{"a":'.repeat(16) + '0' + '}'.repeat(16)),
    ).not.toThrow();
    expect(() => strict('{"a":'.repeat(17) + '0' + '}'.repeat(17))).toThrow(
      api.AppError,
    );
    expect(() => strict('['.repeat(16) + '0' + ']'.repeat(16))).not.toThrow();
    expect(() => strict('['.repeat(17) + '0' + ']'.repeat(17))).toThrow(
      api.AppError,
    );
  });
  it('rejects nested escaped duplicates while preserving independent object key sets', () => {
    expect(() => strict(String.raw`{"a":[{"b":1,"\u0062":2}]}`)).toThrow(
      api.AppError,
    );
    expect(strict('{"a":[{"b":1},{"b":2}]}')).toEqual({
      a: [{ b: 1 }, { b: 2 }],
    });
  });
  it('does not count quoted or escaped brackets as structure', () => {
    expect(strict(JSON.stringify({ text: '[]{}"\\'.repeat(50) }))).toEqual({
      text: '[]{}"\\'.repeat(50),
    });
  });
});
