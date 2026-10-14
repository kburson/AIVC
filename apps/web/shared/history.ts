import type { HistoryMessage } from './contracts';
export function retainPairs(
  input: ReadonlyArray<readonly [HistoryMessage, HistoryMessage]>,
): { pairs: Array<[HistoryMessage, HistoryMessage]>; omitted: boolean } {
  const pairs: Array<[HistoryMessage, HistoryMessage]> = input.map((p) => [
    { ...p[0] },
    { ...p[1] },
  ]);
  const size = (p: [HistoryMessage, HistoryMessage]) =>
    p[0].content.length + p[1].content.length;
  let omitted = false;
  if (pairs.length && size(pairs[pairs.length - 1]) > 16000) {
    pairs.pop();
    omitted = true;
  }
  while (pairs.length > 4 || pairs.reduce((n, p) => n + size(p), 0) > 16000)
    pairs.shift();
  return { pairs, omitted };
}
