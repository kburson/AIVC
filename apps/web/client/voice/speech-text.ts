export const scannerWhitespace = (char: string) => /\s/u.test(char);
function closing(
  text: string,
  start: number,
  open: string,
  close: string,
): number {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close && --depth === 0) return i;
  }
  return -1;
}
function codeEnd(text: string, start: number): number {
  const run = text.slice(start).match(/^`+/u)![0];
  const end = text.indexOf(run, start + run.length);
  return end < 0 ? -1 : end + run.length;
}
function clean(text: string): string {
  let output = '';
  for (let i = 0; i < text.length;) {
    if (text[i] === '`') {
      const end = codeEnd(text, i);
      if (end < 0) break;
      i = end;
      continue;
    }
    if (/^https?:\/\//iu.test(text.slice(i))) {
      const end = text.slice(i).search(/\s/u);
      i = end < 0 ? text.length : i + end;
      continue;
    }
    if (text[i] === '【') {
      const end = text.indexOf('】', i + 1);
      if (end < 0) break;
      i = end + 1;
      continue;
    }
    if (text[i] === '[') {
      const end = closing(text, i, '[', ']');
      if (end < 0) break;
      if (text[end + 1] === '(') {
        const urlEnd = closing(text, end + 1, '(', ')');
        if (urlEnd < 0) break;
        output += text.slice(i + 1, end);
        i = urlEnd + 1;
      } else {
        const label = text.slice(i + 1, end);
        if (!/^\s*(?:\d+[\s,–-]*)+\s*$/u.test(label)) output += label;
        i = end + 1;
      }
      continue;
    }
    output += text[i++];
  }
  return output
    .replace(/[*_#~]/gu, '')
    .replace(/\s+/gu, ' ')
    .replace(/\s+([.,!?;:])/gu, '$1')
    .trim();
}
/** Chunk boundaries never commit punctuation or a partial structured token. */
export class SpeechText {
  private buffer = '';
  private ended = false;
  private initialLine = true;
  private cap: number;
  constructor(
    cap = 84,
    private onOmitted?: (reason: string) => void,
  ) {
    this.cap = Math.max(1, Math.min(120, Math.floor(cap)));
  }
  pendingChars(): number {
    return this.buffer.length;
  }
  private boundary(): number {
    const text = this.buffer;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '`') {
        const end = codeEnd(text, i);
        if (end < 0) return -1;
        i = end - 1;
        continue;
      }
      if (/^https?:\/\//iu.test(text.slice(i))) {
        const end = text.slice(i).search(/\s/u);
        if (end < 0) return -1;
        i += end - 1;
        continue;
      }
      if (text[i] === '【') {
        const end = text.indexOf('】', i + 1);
        if (end < 0) return -1;
        i = end;
        continue;
      }
      if (text[i] === '[') {
        const end = closing(text, i, '[', ']');
        if (end < 0 || end + 1 === text.length) return -1;
        if (text[end + 1] === '(') {
          const linkEnd = closing(text, end + 1, '(', ')');
          if (linkEnd < 0) return -1;
          i = linkEnd;
        } else i = end;
        continue;
      }
      if (
        !/[.!?]/u.test(text[i]) ||
        i + 1 >= text.length ||
        !scannerWhitespace(text[i + 1])
      )
        continue;
      if (text[i] === '.') {
        const prefix = text.slice(0, i + 1);
        // A line-leading list marker belongs to its item, not its own sentence.
        if (
          /\n[ \t]*\d+\.$/u.test(prefix) ||
          (this.initialLine && /^[ \t]*\d+\.$/u.test(prefix))
        )
          continue;
        if (
          /(?:^|[^\p{L}\p{N}_])(?:Dr|Mr|Mrs|Ms|Prof|Sr|Jr|St|vs|etc)\.$/iu.test(
            prefix,
          ) ||
          /(?:[A-Za-z]\.){2,}$/u.test(prefix)
        )
          continue;
      }
      return i + 1;
    }
    return -1;
  }
  private segments(text: string): string[] {
    const words = clean(text).split(/\s/u).filter(Boolean);
    const result: string[] = [];
    const run: string[] = [];
    const flush = () => {
      while (run.length) {
        let end = 0;
        let length = 0;
        let clause = 0;
        while (
          end < run.length &&
          length + (end ? 1 : 0) + run[end].length <= this.cap
        ) {
          length += (end ? 1 : 0) + run[end].length;
          if (/[,;:—–]$/u.test(run[end])) clause = end + 1;
          end++;
        }
        // Only split oversized stable text; preserve existing punctuation/words.
        const take = end < run.length && clause ? clause : end;
        result.push(run.splice(0, take).join(' '));
      }
    };
    for (const word of words) {
      if (word.length > this.cap) {
        flush();
        this.onOmitted?.('SPEECH_TOKEN_TOO_LONG');
      } else run.push(word);
    }
    flush();
    return result;
  }
  push(delta: string): string[] {
    if (this.ended) return [];
    this.buffer += delta;
    const output: string[] = [];
    for (let end = this.boundary(); end >= 0; end = this.boundary()) {
      output.push(...this.segments(this.buffer.slice(0, end)));
      this.buffer = this.buffer.slice(end);
      this.initialLine = false;
    }
    return output;
  }
  finish(): string[] {
    if (this.ended) return [];
    this.ended = true;
    const result = this.segments(this.buffer);
    this.buffer = '';
    return result;
  }
}
