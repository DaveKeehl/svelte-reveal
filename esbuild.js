import { build } from 'esbuild';

build({
	entryPoints: ['src/index.ts'],
	outfile: 'dist/index.js',
	bundle: true,
	minify: true,
	sourcemap: true
});
