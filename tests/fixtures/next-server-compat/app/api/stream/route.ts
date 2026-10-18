import type { AsyncLocalStorage } from 'node:async_hooks';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Observation = {
  pulls: number;
  maxQueuedBytes: number;
  maxChunkBytes: number;
  cancelled: boolean;
  aborted: boolean;
  finished: boolean;
};
type Context = { id: string; observation: Observation };
export function GET(request: Request) {
  const storage = (
    globalThis as typeof globalThis & {
      __aivcNextCompatibility?: AsyncLocalStorage<Context>;
    }
  ).__aivcNextCompatibility;
  const context = storage?.getStore();
  if (!context)
    throw new Error(
      'Custom listener request context did not reach the production route',
    );
  const observation = context.observation;
  request.signal.addEventListener(
    'abort',
    () => {
      observation.aborted = true;
    },
    { once: true },
  );
  const finite = new URL(request.url).searchParams.get('finite') === '1';
  const stream = new ReadableStream<Uint8Array>(
    {
      pull(controller) {
        if (finite && observation.pulls === 4) {
          observation.finished = true;
          controller.close();
          return;
        }
        // No timer, provider, detached producer, accumulated array or unbounded application queue.
        const bytes = new Uint8Array(16384).fill(observation.pulls % 256);
        observation.pulls++;
        controller.enqueue(bytes);
        observation.maxChunkBytes = Math.max(
          observation.maxChunkBytes,
          bytes.byteLength,
        );
        observation.maxQueuedBytes = Math.max(
          observation.maxQueuedBytes,
          65536 - (controller.desiredSize ?? 0),
        );
      },
      cancel() {
        observation.cancelled = true;
      },
    },
    { highWaterMark: 65536, size: (bytes) => bytes.byteLength },
  );
  return new Response(stream, {
    headers: {
      'content-type': 'application/octet-stream',
      'cache-control': 'no-store',
      'x-fixture-context': context.id,
    },
  });
}
