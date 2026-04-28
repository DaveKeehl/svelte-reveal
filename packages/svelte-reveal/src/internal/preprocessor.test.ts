import { describe, expect, it } from 'vitest';
import { VERSION } from 'svelte/compiler';
import { svelteRevealPreprocess } from './preprocessor.ts';

const isSvelte5 = Number.parseInt(String(VERSION ?? ''), 10) >= 5;

type MarkupFn = NonNullable<ReturnType<typeof svelteRevealPreprocess>['markup']>;

const runMarkup = (pp: ReturnType<typeof svelteRevealPreprocess>, content: string, filename = 'Test.svelte') => {
  const result = (pp.markup as MarkupFn)({ content, filename, attributes: {} });
  if (result instanceof Promise) throw new Error('preprocessor returned a Promise');
  return result;
};

describe('svelteRevealPreprocess', () => {
  describe('when ssr is disabled', () => {
    it('leaves markup untouched', () => {
      const pp = svelteRevealPreprocess();
      expect(runMarkup(pp, '<div use:reveal>x</div>')).toBeUndefined();
    });

    it('does not register a script hook', () => {
      const pp = svelteRevealPreprocess();
      expect(pp.script).toBeUndefined();
    });
  });

  describe('class injection', () => {
    it('skips files that do not use the reveal action', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      expect(runMarkup(pp, '<div class="plain">hello</div>')).toBeUndefined();
    });

    it('injects sr__hide on an element with no other attributes', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div use:reveal>x</div>');
      expect(result?.code).toContain('<div class="sr__hide" use:reveal>x</div>');
    });

    it('injects sr__hide on an element that already has other attributes', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div data-foo="bar" use:reveal>x</div>');
      expect(result?.code).toContain('<div class="sr__hide" data-foo="bar" use:reveal>x</div>');
    });

    it('appends sr__hide to a double-quoted class attribute', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div class="foo bar" use:reveal />');
      expect(result?.code).toContain('class="foo bar sr__hide"');
    });

    it('appends sr__hide to a single-quoted class attribute', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, "<div class='foo bar' use:reveal />");
      expect(result?.code).toContain("class='foo bar sr__hide'");
    });

    it('wraps a dynamic class={...} attribute in quotes and appends sr__hide', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, "<div class={cond ? 'a' : 'b'} use:reveal />");
      expect(result?.code).toContain(`class="{cond ? 'a' : 'b'} sr__hide"`);
      expect(result?.code).not.toMatch(/class=[^>]*class=/);
    });

    it('is idempotent when sr__hide is already present', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const input = '<div class="foo sr__hide" use:reveal />';
      const result = runMarkup(pp, input);
      expect(result).toBeUndefined();
    });

    it('ignores use:reveal occurrences inside HTML comments', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      expect(runMarkup(pp, '<!-- <div use:reveal /> --><p>noop</p>')).toBeUndefined();
    });

    it('handles multi-line opening tags', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div\n  data-x="y"\n  use:reveal\n>z</div>');
      expect(result?.code).toContain('class="sr__hide"');
    });

    it('processes every revealed element in the file', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div use:reveal>a</div><span class="x" use:reveal>b</span>');
      expect(result?.code).toContain('<div class="sr__hide" use:reveal>a</div>');
      expect(result?.code).toContain('<span class="x sr__hide" use:reveal>b</span>');
    });

    it('returns invalid Svelte source unchanged', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      expect(runMarkup(pp, '<div use:reveal')).toBeUndefined();
    });
  });

  describe('styles import injection', () => {
    it('synthesizes a <script> block when none exists', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<main><div use:reveal /></main>');
      expect(result?.code).toMatch(/^<script>\s*import 'svelte-reveal\/styles\.css';\s*<\/script>/);
    });

    it('injects the import inside an existing instance script', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<script>let x = 1;</script>\n<div use:reveal />');
      expect(result?.code).toMatch(/<script>\s*import 'svelte-reveal\/styles\.css';\s*let x = 1;\s*<\/script>/);
      expect(result?.code.match(/<script(\s|>)/g)?.length).toBe(1);
    });

    it('does not duplicate the import when it is already present in the script', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const input = `<script>import 'svelte-reveal/styles.css';\nlet x = 1;</script>\n<div use:reveal />`;
      const result = runMarkup(pp, input);
      expect(result?.code.match(/svelte-reveal\/styles\.css/g)?.length).toBe(1);
    });

    it('injects into the instance script, not <script context="module">', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const input =
        '<script context="module">export const x = 1;</script>\n' +
        '<script>let y = 2;</script>\n' +
        '<div use:reveal />';
      const result = runMarkup(pp, input);
      expect(result?.code).toMatch(/<script>\s*import 'svelte-reveal\/styles\.css';\s*let y = 2;\s*<\/script>/);
      expect(result?.code).not.toMatch(/<script context="module">[^<]*svelte-reveal\/styles\.css/);
    });

    it.skipIf(!isSvelte5)('injects into the instance script, not the Svelte 5 <script module> shorthand', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const input =
        '<script module>export const x = 1;</script>\n' + '<script>let y = 2;</script>\n' + '<div use:reveal />';
      const result = runMarkup(pp, input);
      expect(result?.code).toMatch(/<script>\s*import 'svelte-reveal\/styles\.css';\s*let y = 2;\s*<\/script>/);
      expect(result?.code).not.toMatch(/<script module>[^<]*svelte-reveal\/styles\.css/);
    });

    it('synthesizes a <script> block when only a module script exists', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const input = '<script context="module">export const x = 1;</script>\n<div use:reveal />';
      const result = runMarkup(pp, input);
      expect(result?.code).toMatch(/^<script>\s*import 'svelte-reveal\/styles\.css';\s*<\/script>/);
      expect(result?.code).toContain('<script context="module">export const x = 1;</script>');
    });
  });
});
