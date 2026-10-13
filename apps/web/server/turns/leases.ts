import { AppError } from '../../shared/contracts';
export type LeaseKind = 'turn' | 'speech';
export type Lease = { release(): void };
export class LeasePools {
  private held: Record<LeaseKind, number> = { turn: 0, speech: 0 };
  acquire(kind: LeaseKind): Lease {
    if (this.held[kind] >= 2)
      throw new AppError(
        429,
        'BUSY',
        'Busy. Ask again after active work settles.',
        null,
        true,
      );
    this.held[kind]++;
    let released = false;
    return {
      release: () => {
        if (released) return;
        released = true;
        this.held[kind]--;
      },
    };
  }
}
const processState = globalThis as typeof globalThis & {
  __aivcLeasePoolsV1?: LeasePools;
};
export function getLeasePools(): LeasePools {
  return (processState.__aivcLeasePoolsV1 ??= new LeasePools());
}
export function acquireLease(kind: LeaseKind): Lease {
  return getLeasePools().acquire(kind);
}
