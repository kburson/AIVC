import { test, expect } from '@playwright/test';
import { installVoiceHarness } from './voice-harness';
test('typed contract page shows early text, exact cards and completed follow-up history; refresh clears context', async ({
  page,
}) => {
  await installVoiceHarness(page);
  await page.goto('/');
  await expect(
    page.getByText('Mock/Contract Simulation', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Question', { exact: true }).fill('Atlas?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(
    page.getByText('Let me check Atlas.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Working');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await expect(
    page.getByRole('region', { name: 'Atlas project' }),
  ).toContainText('active · North · 3 open items');
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(1);
  expect(await page.evaluate(() => window.__aivcHarness.calls[0].url)).toBe(
    'http://127.0.0.1:3000/api/turn',
  );
  await page.evaluate(() => window.__aivcHarness.release());
  await expect(page.getByRole('status')).toHaveText('Ready');
  await page.getByLabel('Question', { exact: true }).fill('Follow up');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.__aivcHarness.calls.length))
    .toBe(2);
  expect(
    await page.evaluate(() => window.__aivcHarness.calls[1].history),
  ).toEqual([
    { role: 'user', content: 'Atlas?' },
    {
      role: 'assistant',
      content:
        'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
    },
  ]);
  await page.reload();
  await page.getByLabel('Question', { exact: true }).fill('Fresh question');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.__aivcHarness.calls.length))
    .toBe(1);
  expect(
    await page.evaluate(() => window.__aivcHarness.calls[0].history),
  ).toEqual([]);
});
test('typed contract Busy recovery is deliberate and Strict Mode sends one request per submit', async ({
  page,
}) => {
  await installVoiceHarness(page, { busyFirst: true, holdFirst: false });
  await page.goto('/');
  await page.getByLabel('Question', { exact: true }).fill('First');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Busy');
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(1);
  await page.getByLabel('Question', { exact: true }).fill('Try again');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(
    page.getByText('Let me check Atlas.', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.__aivcHarness.calls.length)).toBe(2);
});
test('typed contract source links allow HTTP(S) and leave unsafe references readable', async ({
  page,
}) => {
  await installVoiceHarness(page, { holdFirst: false });
  await page.goto('/');
  await page.getByLabel('Question', { exact: true }).fill('Atlas?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  const link = page.getByRole('link', { name: 'Documentation' });
  await expect(link).toHaveAttribute('href', 'https://example.test/docs');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(link).toHaveAttribute('target', '_blank');
  for (const name of ['Unsafe source', 'Data source', 'Relative source']) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name, exact: true })).toHaveCount(0);
  }
});
test('typed contract Stop excludes an unfinished turn from the next request', async ({
  page,
}) => {
  await installVoiceHarness(page);
  await page.goto('/');
  await page.getByLabel('Question', { exact: true }).fill('Atlas?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(
    page.getByText('Let me check Atlas.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(
    page.getByText('Stopped. This turn was not added to context.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel('Question', { exact: true }).fill('Ask again');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.__aivcHarness.calls.length))
    .toBe(2);
  expect(
    await page.evaluate(() => window.__aivcHarness.calls[1].history),
  ).toEqual([]);
});
test('typed harness matches the same-origin endpoint and distrusts a foreign endpoint', async ({
  page,
}) => {
  // An unmatched foreign request is denied by a test-side base transport.
  // No foreign network request or provider call is made.
  await page.addInitScript(() => {
    const original = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const request = new Request(input, init);
      if (new URL(request.url).origin !== location.origin)
        return Promise.resolve(
          new Response('Unmatched foreign endpoint', { status: 418 }),
        );
      return original(input, init);
    };
  });
  await installVoiceHarness(page, { holdFirst: false });
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const local = await fetch(new URL('api/capabilities', location.origin));
    const foreign = await fetch('https://foreign.invalid/api/capabilities');
    return {
      local: await local.json(),
      foreignStatus: foreign.status,
      foreignText: await foreign.text(),
      calls: window.__aivcHarness.calls.length,
    };
  });
  expect(result.local.mode).toBe('mock');
  expect(result.local.search.accountValidation).toBe('unavailable');
  expect(result.foreignStatus).toBe(418);
  expect(result.foreignText).toBe('Unmatched foreign endpoint');
  expect(result.calls).toBe(0);
});
