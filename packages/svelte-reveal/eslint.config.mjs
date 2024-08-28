import js from '@eslint/js';
import ts from 'typescript-eslint';
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
  js.configs.recommended,
  ...ts.configs.recommended,
  turbo,
  prettier,
  {
    plugins: { '@typescript-eslint': ts.plugin },
    languageOptions: {
      parser: ts.parser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
];
