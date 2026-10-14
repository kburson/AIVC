// Test-only Mock/Contract Simulation transport. Never imported by production.
import type { Page } from '@playwright/test';
import type { HistoryMessage } from '../../apps/web/shared/contracts';
import {
  mockCapabilities,
  wireEvents,
} from '../helpers/wire-contract-fixtures';
export type HarnessCall = {
  url: string;
  text: string;
  history: HistoryMessage[];
  turnId: string;
};
declare global {
  interface Window {
    __aivcHarness: { calls: HarnessCall[]; release: () => void };
    captureSimulation: {
      requests: MediaStreamConstraints[];
      stops: number[];
      loadedWorklets: string[];
      release(): void;
    };
  }
}
/** Real browser/VAD/ORT; only microphone permission and silent test audio are synthetic. */
export async function installSyntheticMicrophone(
  page: Page,
  { hold = false, deny = false } = {},
) {
  await page.addInitScript(
    ({ hold, deny }) => {
      const state: Window['captureSimulation'] = {
        requests: [],
        stops: [],
        loadedWorklets: [],
        release() {},
      };
      window.captureSimulation = state;
      const addModule = AudioWorklet.prototype.addModule;
      AudioWorklet.prototype.addModule = async function (...args) {
        await addModule.apply(this, args);
        state.loadedWorklets.push(String(args[0]));
      };
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      state.release = release;
      navigator.mediaDevices.getUserMedia = async (constraints) => {
        state.requests.push(constraints ?? {});
        if (deny && state.requests.length === 1)
          throw new DOMException(
            'Synthetic permission denial',
            'NotAllowedError',
          );
        if (hold && state.requests.length === 1) await gate;
        const context = new AudioContext(),
          destination = context.createMediaStreamDestination();
        await context.resume();
        const track = destination.stream.getAudioTracks()[0],
          stop = track.stop.bind(track),
          index = state.stops.length;
        state.stops.push(0);
        track.stop = () => {
          state.stops[index]++;
          stop();
          void context.close();
        };
        return destination.stream;
      };
    },
    { hold, deny },
  );
}
export async function installVoiceHarness(
  page: Page,
  { holdFirst = true, busyFirst = false } = {},
) {
  await page.addInitScript(
    ({ capabilities, events, holdFirst, busyFirst }) => {
      const original = window.fetch.bind(window),
        calls: HarnessCall[] = [],
        pending: Array<() => void> = [];
      const capabilitiesURL = new URL('api/capabilities', location.origin).href;
      const turnURL = new URL('api/turn', location.origin).href;
      window.__aivcHarness = {
        calls,
        release: () => {
          for (const release of pending.splice(0)) release();
        },
      };
      window.fetch = async (input, init) => {
        const request = new Request(input, init),
          url = new URL(request.url);
        if (url.origin !== location.origin) return original(input, init);
        if (url.href === capabilitiesURL)
          return new Response(JSON.stringify(capabilities), {
            headers: { 'content-type': 'application/json' },
          });
        if (url.href !== turnURL) return original(input, init);
        const form = await request.clone().formData();
        const turnId = String(form.get('turnId')),
          text = String(form.get('text')),
          history = JSON.parse(String(form.get('history'))) as HistoryMessage[];
        calls.push({ url: url.href, turnId, text, history });
        if (busyFirst && calls.length === 1)
          return new Response(
            JSON.stringify({
              error: { code: 'BUSY', message: 'Busy', turnId, retryable: true },
            }),
            { status: 429, headers: { 'content-type': 'application/json' } },
          );
        const payloads = events.map((e) => ({ ...e, turnId }));
        payloads.splice(3, 0, {
          schemaVersion: 1,
          turnId,
          seq: 3,
          type: 'sources',
          data: {
            sources: [
              { title: 'Documentation', url: 'https://example.test/docs' },
              { title: 'Unsafe source', url: 'javascript:alert(1)' },
              { title: 'Data source', url: 'data:text/html,unsafe' },
              { title: 'Relative source', url: 'relative/path' },
            ],
          },
        });
        const output = payloads.map((e, seq) => ({ ...e, seq }));
        let ended = false;
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            const send = (e: (typeof output)[number]) =>
              controller.enqueue(
                new TextEncoder().encode(
                  'event: ' + e.type + '\ndata: ' + JSON.stringify(e) + '\n\n',
                ),
              );
            const finish = () => {
              if (ended) return;
              send(output.at(-1)!);
              ended = true;
              controller.close();
            };
            for (const e of output.slice(0, -1)) send(e);
            request.signal.addEventListener(
              'abort',
              () => {
                if (!ended) {
                  ended = true;
                  controller.error(new DOMException('Aborted', 'AbortError'));
                }
              },
              { once: true },
            );
            if (holdFirst && calls.length === 1) pending.push(finish);
            else finish();
          },
        });
        return new Response(stream, {
          headers: { 'content-type': 'text/event-stream' },
        });
      };
    },
    {
      capabilities: mockCapabilities,
      events: wireEvents,
      holdFirst,
      busyFirst,
    },
  );
}
