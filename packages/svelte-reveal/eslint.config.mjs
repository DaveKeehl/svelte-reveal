import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslint from '@eslint/js';
import turbo from 'eslint-config-turbo';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules',
      '**/.pnp',
      '**/.pnp.js',
      '**/dist/',
      '**/coverage/',
      '**/.next/',
      '**/out/',
      '**/build',
      '**/.DS_Store',
      '**/*.pem',
      '**/svelte-reveal-*.tgz',
      '**/debug.json',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
      '**/.pnpm-debug.log*',
      '**/.env.local',
      '**/.env.development.local',
      '**/.env.test.local',
      '**/.env.production.local',
      '**/.turbo',
      '**/.vercel',
      '**/*.tsbuildinfo',
      '**/next-env.d.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  turbo,
  prettier,
  {
    plugins: { '@typescript-eslint': typescriptEslint },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
];
