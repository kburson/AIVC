import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import {
  installVoiceHarness,
  installSyntheticMicrophone as syntheticMicrophone,
} from './voice-harness';
// Real browser/model loading with labeled synthetic silent streams. No physical microphone/provider/echo claim.
async function snapshot(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const state = (
      window as unknown as {
        captureSimulation: {
          requests: MediaStreamConstraints[];
          stops: number[];
        };
      }
    ).captureSimulation;
    return { requests: state.requests, stops: state.stops };
  });
}
test('capture actual local pinned asset HTTP/MIME/digests and real patched VAD/ORT model load with synthetic silence', async ({
  page,
}) => {
  test.setTimeout(120000);
  const manifest = JSON.parse(
    readFileSync('apps/web/public/vad/manifest.json', 'utf8'),
  );
  const require = createRequire(resolve('apps/web/package.json'));
  const vadRoot = dirname(dirname(require.resolve('@ricky0123/vad-web')));
  const sha = (bytes: Uint8Array) =>
    createHash('sha256').update(bytes).digest('hex');
  expect(manifest.vad.version).toBe('0.0.31');
  expect(manifest.ort.version).toBe('1.30.0');
  expect(manifest.vad.upstreamGitHead).toBe(
    'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d',
  );
  expect(manifest.vad.lifecyclePatchRevision).toBe('aivc-vad-lifecycle-v1');
  expect(manifest.patch.sha256).toBe(sha(readFileSync(manifest.patch.path)));
  for (const [path, digest] of Object.entries(manifest.appliedModules))
    expect(sha(readFileSync(join(vadRoot, path)))).toBe(digest);
  for (const [path, file] of Object.entries(manifest.files) as Array<
    [string, { sha256: string }]
  >) {
    const response = await page.request.get('/vad/' + path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toMatch(
      path.endsWith('.wasm')
        ? /application\/wasm/
        : path.endsWith('.onnx')
          ? /application\/octet-stream/
          : /(?:text|application)\/javascript/,
    );
    expect(sha(await response.body()), path).toBe(file.sha256);
  }
  const assets: string[] = [],
    foreign: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith('/vad/')) assets.push(url.pathname);
    if (
      url.protocol.startsWith('http') &&
      url.origin !== 'http://127.0.0.1:3000'
    )
      foreign.push(url.href);
  });
  await installVoiceHarness(page, { holdFirst: false });
  await syntheticMicrophone(page);
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Listening', {
    timeout: 60000,
  });
  expect(assets).toContain('/vad/silero_vad_v5.onnx');
  expect(
    await page.evaluate(() => window.captureSimulation.loadedWorklets),
  ).toContain('/vad/vad.worklet.bundle.min.js');
  expect(
    assets.some(
      (path) => path.startsWith('/vad/ort/') && path.endsWith('.wasm'),
    ),
  ).toBe(true);
  expect(foreign).toEqual([]);
  expect((await snapshot(page)).requests).toHaveLength(1);
  await page.getByLabel('Mute microphone', { exact: true }).check();
  await expect.poll(async () => (await snapshot(page)).stops).toEqual([1]);
  await page.getByLabel('Mute microphone', { exact: true }).uncheck();
  await expect(page.getByRole('status')).toHaveText('Listening');
  expect((await snapshot(page)).requests).toHaveLength(2);
  await page.getByLabel('Mute output', { exact: true }).check();
  expect((await snapshot(page)).stops).toEqual([1, 0]);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect.poll(async () => (await snapshot(page)).stops).toEqual([1, 1]);
  expect(await page.evaluate(() => window.__aivcHarness.calls)).toHaveLength(0);
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Listening');
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect
    .poll(async () => (await snapshot(page)).stops)
    .toEqual([1, 1, 1]);
});
test('capture pending synthetic permission then Stop releases the late stream and permits a fresh Start', async ({
  page,
}) => {
  test.setTimeout(90000);
  await installVoiceHarness(page, { holdFirst: false });
  await syntheticMicrophone(page, { hold: true });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect
    .poll(async () => (await snapshot(page)).requests.length, {
      timeout: 60000,
    })
    .toBe(1);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Start conversation', exact: true }),
  ).toBeDisabled();
  await page.evaluate(() =>
    (
      window as unknown as { captureSimulation: { release(): void } }
    ).captureSimulation.release(),
  );
  await expect.poll(async () => (await snapshot(page)).stops).toEqual([1]);
  await expect(
    page.getByRole('button', { name: 'Start conversation', exact: true }),
  ).toBeEnabled();
  expect(await page.evaluate(() => window.__aivcHarness.calls)).toHaveLength(0);
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Listening');
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect.poll(async () => (await snapshot(page)).stops).toEqual([1, 1]);
});
test('capture permission denial and actual local model-load failure remain visible with typed fallback', async ({
  page,
}) => {
  test.setTimeout(90000);
  await installVoiceHarness(page, { holdFirst: false });
  await syntheticMicrophone(page, { deny: true });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.locator('main [role="alert"]')).toContainText(
    'permission was denied',
    {
      timeout: 60000,
    },
  );
  await page.getByLabel('Question', { exact: true }).fill('Typed after denial');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(
    page.getByRole('region', { name: 'Atlas project' }),
  ).toBeVisible();
  expect((await snapshot(page)).requests).toHaveLength(1);
  await page.reload();
  await page.route('**/vad/silero_vad_v5.onnx', (route) => route.abort());
  await page
    .getByRole('button', { name: 'Start conversation', exact: true })
    .click();
  await expect(page.locator('main [role="alert"]')).toContainText(
    'could not load',
    {
      timeout: 60000,
    },
  );
  expect((await snapshot(page)).requests).toHaveLength(0);
});
