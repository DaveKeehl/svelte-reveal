import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: false,
  sourcemap: false,
  format: 'esm',
  tsconfig: 'tsconfig.build.json',
  watch: process.argv[2] === '--watch'
});
