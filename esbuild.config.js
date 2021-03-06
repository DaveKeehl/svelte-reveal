import { build } from 'esbuild';

build({
	entryPoints: ['src/index.ts'],
	outfile: 'dist/index.js',
	bundle: true,
	minify: false,
	sourcemap: false,
	format: 'esm',
	watch: process.argv[2] === '--watch'
});
