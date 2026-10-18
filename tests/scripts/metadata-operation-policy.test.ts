import { expect, it } from 'vitest';

it('admits only the governed #63 metadata operation input in Develop without widening other paths or states', async () => {
  const { classifyEdit, loadPolicy, isAllowed } = await import(
    new URL(
      '../../node_modules/@kburson/ai-task-manager/scripts/task-tracker/activity-policy.mjs',
      import.meta.url,
    ).href
  );
  const policy = loadPolicy(process.cwd());
  const activity = classifyEdit(
    '.scratch/gh/63-current-plan-metadata.json',
    policy,
  );
  expect(isAllowed('develop', activity)).toBe(true);
  expect(isAllowed('plan', activity)).toBe(false);
  expect(isAllowed('review', activity)).toBe(false);
  for (const path of [
    '.scratch/gh/63-unrelated.json',
    '.scratch/gh/64-current-plan-metadata.json',
    '.scratch/unrelated.json',
  ]) {
    expect(isAllowed('develop', classifyEdit(path, policy))).toBe(false);
  }
});
