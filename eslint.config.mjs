import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    'vendors/**',
    '.scratch/**',
    '.tmp/**',
    '.superpowers/**',
    '.claude/worktrees/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.cache/**',
    '**/.turbo/**',
    '**/public/vendor/**',
    'apps/web/public/vad/**',
    '**/next-env.d.ts',
  ]),
  { files: ['**/*.{ts,tsx,mts,cts}'], extends: [tseslint.configs.recommended] },
  {
    files: ['apps/web/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    extends: [nextVitals, nextTypescript],
    settings: { next: { rootDir: 'apps/web/' } },
  },
  prettier,
]);
