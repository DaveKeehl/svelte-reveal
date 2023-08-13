import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: false,
  sourcemap: false,
  format: 'esm',
  tsconfig: 'tsconfig.build.json'
});
