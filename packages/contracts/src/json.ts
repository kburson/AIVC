import { AppError } from './contracts.js';

function invalid(): never {
  throw new AppError(400, 'INVALID_REQUEST', 'Invalid request.', null, false);
}
type Frame =
  { kind: 'object'; keys: Set<string>; wantsKey: boolean } | { kind: 'array' };

/** Lexical safety checks only; JSON.parse remains the syntax authority. */
function preflight(text: string): void {
  const stack: Frame[] = [];
  for (let at = 0; at < text.length; at++) {
    const char = text[at];
    if (char === '"') {
      const start = at++;
      for (; at < text.length; at++) {
        if (text[at] === '\\') at++;
        else if (text[at] === '"') break;
      }
      if (at >= text.length) return; // JSON.parse rejects unterminated syntax.
      const owner = stack.at(-1);
      if (owner?.kind === 'object' && owner.wantsKey) {
        const key: string = JSON.parse(text.slice(start, at + 1));
        if (owner.keys.has(key)) invalid();
        owner.keys.add(key);
        owner.wantsKey = false;
      }
    } else if (char === '{' || char === '[') {
      stack.push(
        char === '{'
          ? { kind: 'object', keys: new Set(), wantsKey: true }
          : { kind: 'array' },
      );
      if (stack.length > 16) invalid();
    } else if (char === '}' || char === ']') {
      stack.pop();
    } else if (char === ',') {
      const owner = stack.at(-1);
      if (owner?.kind === 'object') owner.wantsKey = true;
    }
  }
}

/** Strict UTF-8, bounded raw input, decoded-key uniqueness and depth <= 16. */
export function parseStrictJson(bytes: Uint8Array): unknown {
  if (bytes.byteLength > 2097152) {
    throw new AppError(
      413,
      'BODY_TOO_LARGE',
      'Request exceeds 2 MiB.',
      null,
      false,
    );
  }
  try {
    const text = new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
    preflight(text);
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof AppError) throw error;
    return invalid();
  }
}
