import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { wireEvents } from '../helpers/wire-contract-fixtures';

const root = fileURLToPath(new URL('../../', import.meta.url));
const packageRoot = resolve(root, 'packages/contracts');

it('requires real public exports and follows their complete browser-safe dependency closure', () => {
  const manifestPath = resolve(packageRoot, 'package.json');
  expect(
    existsSync(manifestPath),
    'the neutral contract package must exist',
  ).toBe(true);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  expect(manifest.name).toBe('@aivc/contracts');
  expect(manifest.type).toBe('module');
  expect(manifest.exports['.']).toEqual({
    types: './dist/index.d.ts',
    import: './dist/index.js',
  });
  const entries = Object.values(manifest.exports).flatMap((entry) =>
    typeof entry === 'string'
      ? [entry]
      : Object.values(entry as Record<string, string>),
  );
  expect(entries.length).toBeGreaterThan(0);
  const visited = new Set<string>();
  function walk(file: string) {
    if (visited.has(file)) return;
    expect(file.startsWith(packageRoot + sep)).toBe(true);
    expect(
      existsSync(file),
      'every exported/transitive module must exist',
    ).toBe(true);
    visited.add(file);
    const text = readFileSync(file, 'utf8');
    expect(text).not.toMatch(
      /NodeJS\.ProcessEnv|process\.env|Anthropic|\brequire\s*\(/,
    );
    const imports = [
      ...text.matchAll(
        /(?:import|export)\s+(?:[^;]*?\s+from\s+)?["\x27]([^"\x27]+)["\x27]/g,
      ),
      ...text.matchAll(/import\s*\(\s*["\x27]([^"\x27]+)["\x27]\s*\)/g),
    ];
    for (const match of imports) {
      const name = match[1];
      expect(name).not.toMatch(
        /(^node:|server\/|providers?\/|config|@anthropic-ai|@deepgram|tests\/)/,
      );
      expect(
        name.startsWith('.'),
        'browser contracts cannot import runtime packages',
      ).toBe(true);
      const target = file.endsWith('.d.ts')
        ? name.replace(/\.js$/, '.d.ts')
        : name;
      walk(resolve(dirname(file), target));
    }
  }
  for (const entry of entries) walk(resolve(packageRoot, entry as string));
  expect(
    visited.size,
    'an empty or index-only walk cannot establish safety',
  ).toBeGreaterThan(4);
  for (const name of ['contracts', 'validation', 'history', 'sse']) {
    expect(
      existsSync(resolve(root, 'apps/web/shared', name + '.ts')),
      'the old handwritten implementation must move, not become a second copy',
    ).toBe(false);
  }
});

it('consumes the compiled public package while retaining the frozen complete wire sequence', async () => {
  const { assertTurnSequence, validateTurnEvent, encodeSse } =
    await import('@aivc/contracts');
  assertTurnSequence(wireEvents);
  for (const event of wireEvents)
    expect(validateTurnEvent(event)).toEqual(event);
  expect(new TextDecoder().decode(encodeSse(wireEvents[0]))).toBe(
    'event: turn.accepted\ndata: {"schemaVersion":1,"turnId":"11111111-1111-4111-8111-111111111111","seq":0,"type":"turn.accepted","data":{"mode":"mock"}}\n\n',
  );
});
