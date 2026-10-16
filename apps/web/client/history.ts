import type { HistoryMessage, TurnStatus } from '../shared/contracts';
import { retainPairs } from '../shared/history';
import type { TurnToken } from './turn-controller';
export class HistoryStore {
  private pairs: Array<[HistoryMessage, HistoryMessage]> = [];
  private completed = new Set<string>();
  constructor(private readonly isCurrent: (token: TurnToken) => boolean) {}
  complete(
    token: TurnToken,
    user: string,
    text: string,
    status: TurnStatus,
  ): { omitted: boolean } {
    const key = token.generation + ':' + token.turnId;
    if (
      !this.isCurrent(token) ||
      status !== 'complete' ||
      !user.trim() ||
      this.completed.has(key)
    )
      return { omitted: false };
    this.completed.add(key);
    const retained = retainPairs([
      ...this.pairs,
      [
        { role: 'user', content: user },
        { role: 'assistant', content: text },
      ],
    ]);
    this.pairs = retained.pairs;
    return { omitted: retained.omitted };
  }
  messages(): HistoryMessage[] {
    return Object.freeze(
      this.pairs.flatMap((pair) =>
        pair.map((message) => Object.freeze({ ...message })),
      ),
    ) as HistoryMessage[];
  }
}
