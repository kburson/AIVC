import { test, expect } from '@playwright/test';
import { build } from 'esbuild';
import { resolve } from 'node:path';
import { installVoiceHarness } from './voice-harness';
let bundle: string;
test.beforeAll(async () => {
  const result = await build({
    entryPoints: ['tests/browser/interruption-entry.tsx'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"test"' },
    plugins: [
      {
        name: 'controlled-vad-boundary',
        setup(builder) {
          builder.onResolve({ filter: /vad-adapter$/ }, () => ({
            path: resolve('tests/browser/interruption-driver.ts'),
          }));
        },
      },
    ],
  });
  bundle = result.outputFiles[0].text;
});
async function start(page: import('@playwright/test').Page, speech = true) {
  await installVoiceHarness(page, { speech, beaconAfterFirst: true });
  await page.route('**/interruption-test', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body><p>Mock/Contract Simulation — real browser audio, controlled VAD/transport</p><div id="test-root"></div></body></html>',
    }),
  );
  await page.goto('/interruption-test');
  await page.addScriptTag({ content: bundle });
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Listening');
  await page.getByLabel('Question', { exact: true }).fill('Atlas?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  if (speech)
    await expect
      .poll(() =>
        page.evaluate(() => window.interruptionSimulation.sources.length),
      )
      .toBeGreaterThan(0);
  else await expect(page.getByRole('status')).toHaveText('Working');
}
test('interruption actual browser callback-to-reversible-silence is <=200ms and confirmed Beacon schedules new audio', async ({
  page,
}, info) => {
  await start(page);
  const token = await page.evaluate(() => window.interruptionSimulation.raw());
  await expect
    .poll(() =>
      page.evaluate(() => window.interruptionSimulation.silenceAt.length),
    )
    .toBe(1);
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(1);
  expect(await page.evaluate(() => window.__aivcHarness.abortTimes)).toEqual(
    [],
  );
  await page.evaluate((id) => window.interruptionSimulation.confirm(id), token);
  await expect
    .poll(() => page.evaluate(() => window.__aivcHarness.abortTimes.length))
    .toBe(1);
  await page.evaluate((id) => {
    window.interruptionSimulation.end(id);
    window.interruptionSimulation.end(id);
  }, token);
  await expect(
    page.getByRole('region', { name: 'Beacon project' }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.interruptionSimulation.sources.some(
          (s) => s.turn === 2 && s.length > 0 && !s.stopped,
        ),
      ),
    )
    .toBe(true);
  const timing = await page.evaluate(() => ({
    callbackToSilenceMs:
      window.interruptionSimulation.silenceAt[0] -
      window.interruptionSimulation.rawAt[0],
    confirmationToAbortMs:
      window.__aivcHarness.abortTimes[0] -
      window.interruptionSimulation.confirmAt[0],
    settings: window.interruptionSimulation.settings,
    calls: window.__aivcHarness.calls.length,
  }));
  console.info(
    'Synthetic browser interruption timing: ' + JSON.stringify(timing),
  );
  expect(timing.calls).toBe(2);
  expect(timing.callbackToSilenceMs).toBeLessThanOrEqual(200);
  expect(timing.confirmationToAbortMs).toBeGreaterThanOrEqual(0);
  await info.attach('synthetic-interruption-timing', {
    body: JSON.stringify(timing, null, 2),
    contentType: 'application/json',
  });
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
});
test('interruption short misfire preserves Speaking audio with zero new turns', async ({
  page,
}) => {
  await start(page);
  const before = await page.evaluate(
    () => window.interruptionSimulation.sources.length,
  );
  const token = await page.evaluate(() => window.interruptionSimulation.raw());
  await expect
    .poll(() =>
      page.evaluate(() => window.interruptionSimulation.silenceAt.length),
    )
    .toBe(1);
  await page.evaluate((id) => window.interruptionSimulation.misfire(id), token);
  await expect(page.getByRole('status')).toHaveText('Speaking');
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(1);
  expect(await page.evaluate(() => window.__aivcHarness.abortTimes)).toEqual(
    [],
  );
  expect(
    await page.evaluate(() => window.interruptionSimulation.sources.length),
  ).toBe(before);
  expect(
    await page.evaluate(() => window.interruptionSimulation.sources[0].stopped),
  ).toBe(false);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
});
test('interruption delayed native suspend after confirmation cannot resurrect old audio and Beacon still schedules', async ({
  page,
}) => {
  await start(page);
  const token = await page.evaluate(() => {
    window.interruptionSimulation.delaySuspend = true;
    return window.interruptionSimulation.raw();
  });
  await page.evaluate((id) => window.interruptionSimulation.confirm(id), token);
  expect(
    await page.evaluate(() => window.interruptionSimulation.sources[0].stopped),
  ).toBe(true);
  await page.evaluate((id) => {
    window.interruptionSimulation.end(id);
    window.interruptionSimulation.delaySuspend = false;
    window.interruptionSimulation.releaseSuspend();
  }, token);
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.interruptionSimulation.sources.some(
          (s) => s.turn === 2 && !s.stopped,
        ),
      ),
    )
    .toBe(true);
  expect(
    await page.evaluate(() =>
      window.interruptionSimulation.sources
        .filter((s) => s.turn === 1)
        .every((s) => s.stopped),
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
});

test('interruption Working misfire preserves the pending answer with no speech request, abort or paid replay', async ({
  page,
}) => {
  await start(page, false);
  const token = await page.evaluate(() => window.interruptionSimulation.raw());
  await expect
    .poll(() =>
      page.evaluate(() => window.interruptionSimulation.silenceAt.length),
    )
    .toBe(1);
  await page.evaluate((id) => window.interruptionSimulation.misfire(id), token);
  await expect(page.getByRole('status')).toHaveText('Working');
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(1);
  expect(await page.evaluate(() => window.__aivcHarness.abortTimes)).toEqual(
    [],
  );
  expect(
    await page.evaluate(() => window.__aivcHarness.speechRequests),
  ).toEqual([]);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
});
