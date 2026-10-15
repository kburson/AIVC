import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from '@playwright/test';
import { parseTurn } from '../../apps/web/shared/validation';
import { assertTurnSequence, decodeSse } from '../../apps/web/shared/sse';
import type { TurnEvent } from '../../apps/web/shared/contracts';
const control = 'http://127.0.0.1:3001/__test';
async function configure(
  request: APIRequestContext,
  mode: 'normal' | 'hold' | 'fail',
) {
  const response = await request.post(control + '/configure', {
    data: { mode },
  });
  expect(response.ok()).toBe(true);
}
async function ask(page: Page, question = 'What is the status of Atlas?') {
  await page.goto('/');
  await page.getByLabel('Mute output', { exact: true }).check();
  await page.getByLabel('Question', { exact: true }).fill(question);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
}
test.beforeEach(async ({ request }) => configure(request, 'normal'));
test.afterEach(async ({ request }) => {
  await request.post(control + '/release');
});
test('actual Next and Fastify stream early text, exact cards, final text and completed follow-up history without turn interception', async ({
  page,
  request,
}) => {
  await configure(request, 'hold');
  const sent: Promise<Awaited<ReturnType<typeof parseTurn>>>[] = [];
  const observer = await page.context().newCDPSession(page);
  await observer.send('Network.enable', { maxPostDataSize: 2097152 });
  observer.on('Network.requestWillBeSent', (event) => {
    if (new URL(event.request.url).pathname !== '/api/turn') return;
    const observed = observer
      .send('Network.getRequestPostData', { requestId: event.requestId })
      .then(({ postData }) =>
        parseTurn(
          new TextEncoder().encode(postData),
          event.request.headers['Content-Type'],
        ),
      );
    void observed.catch(() => {});
    sent.push(observed);
  });
  const response = page.waitForResponse(
    (r) => new URL(r.url()).pathname === '/api/turn',
  );
  await ask(page);
  await expect(
    page.getByText('Let me check Atlas.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Working');
  const earlyMarks = await page.evaluate(() =>
    performance.getEntriesByType('mark').map((mark) => mark.name.split(':')[0]),
  );
  expect(earlyMarks).toEqual(
    expect.arrayContaining(['aivc.turn-request', 'aivc.answer.delta']),
  );
  expect(earlyMarks).not.toContain('aivc.turn.completed');

  await expect(page.getByRole('region', { name: 'Atlas project' })).toHaveCount(
    0,
  );
  expect((await (await request.get(control + '/state')).json()).pending).toBe(
    1,
  );
  await request.post(control + '/release');
  await expect(page.getByRole('status')).toHaveText('Ready');
  await expect(
    page.getByRole('region', { name: 'Atlas project' }),
  ).toContainText('active · North · 3 open items');
  const bytes = new Uint8Array(await (await response).body());
  const events: TurnEvent[] = [];
  for await (const event of decodeSse(
    (async function* () {
      yield bytes;
    })(),
  ))
    events.push(event);
  assertTurnSequence(events);
  const text = events
    .filter((e) => e.type === 'answer.delta')
    .map((e) => e.data.text)
    .join('');
  expect(text).toBe(
    'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
  );
  expect(events.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { text, status: 'complete' },
  });
  await expect(page.getByLabel('Conversation timeline')).toContainText(
    'Atlas is active, owned by North, with 3 open items.',
  );
  await page.getByLabel('Question', { exact: true }).fill('Who owns it?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Ready');
  await expect.poll(() => sent.length).toBe(2);
  expect((await sent[0]).history).toEqual([]);
  expect((await sent[1]).history).toEqual([
    { role: 'user', content: 'What is the status of Atlas?' },
    { role: 'assistant', content: text },
  ]);
  await expect(page.getByLabel('Capabilities')).toContainText(
    'Search: unavailable',
  );
});
test('actual retrieval HTTP failure stays visible without fabricated cards and a deliberate new turn recovers', async ({
  page,
  request,
}) => {
  await configure(request, 'fail');
  await ask(page);
  await expect(
    page.getByText(
      'Project retrieval failed. Submit a new question when ready.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Atlas project' })).toHaveCount(
    0,
  );
  expect(
    (await (await request.get(control + '/state')).json()).requests,
  ).toEqual(['Atlas']);
  await configure(request, 'normal');
  await page
    .getByLabel('Question', { exact: true })
    .fill('What is the status of Atlas?');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(
    page.getByRole('region', { name: 'Atlas project' }),
  ).toContainText('active · North · 3 open items');
});
test('actual shared turn admission returns Busy without automatic retry and accepts deliberate recovery', async ({
  context,
  request,
}) => {
  await configure(request, 'hold');
  const first = await context.newPage(),
    second = await context.newPage(),
    busy = await context.newPage();
  try {
    await ask(first);
    await expect(
      first.getByText('Let me check Atlas.', { exact: true }),
    ).toBeVisible();
    await ask(second);
    await expect(
      second.getByText('Let me check Atlas.', { exact: true }),
    ).toBeVisible();
    await ask(busy);
    await expect(busy.getByRole('status')).toHaveText('Busy');
    expect(
      (await (await request.get(control + '/state')).json()).requests,
    ).toHaveLength(2);
    await request.post(control + '/release');
    await expect(first.getByRole('status')).toHaveText('Ready');
    await expect(second.getByRole('status')).toHaveText('Ready');
    await busy
      .getByLabel('Question', { exact: true })
      .fill('What is the status of Atlas?');
    await busy.getByRole('button', { name: 'Start', exact: true }).click();
    await expect(
      busy.getByRole('region', { name: 'Atlas project' }),
    ).toContainText('active · North · 3 open items');
    expect(
      (await (await request.get(control + '/state')).json()).requests,
    ).toHaveLength(3);
  } finally {
    await request.post(control + '/release');
    await Promise.all([first.close(), second.close(), busy.close()]);
  }
});
