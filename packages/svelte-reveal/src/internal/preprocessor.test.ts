import { describe, expect, it } from 'vitest';
import { svelteRevealPreprocess } from './preprocessor.ts';

type MarkupFn = NonNullable<ReturnType<typeof svelteRevealPreprocess>['markup']>;
type ScriptFn = NonNullable<ReturnType<typeof svelteRevealPreprocess>['script']>;

const runMarkup = (pp: ReturnType<typeof svelteRevealPreprocess>, content: string, filename = 'Test.svelte') => {
  const result = (pp.markup as MarkupFn)({ content, filename, attributes: {} });
  return result instanceof Promise ? null : result;
};

const runScript = (
  pp: ReturnType<typeof svelteRevealPreprocess>,
  content: string,
  filename = 'Test.svelte',
  attributes: Record<string, string | boolean> = {}
) => {
  const result = (pp.script as ScriptFn)({ content, filename, attributes, markup: '' });
  return result instanceof Promise ? null : result;
};

describe('svelteRevealPreprocess', () => {
  describe('when ssr is disabled', () => {
    it('leaves markup untouched', () => {
      const pp = svelteRevealPreprocess();
      const result = runMarkup(pp, '<div use:reveal>x</div>');
      expect(result).toBeUndefined();
    });

    it('leaves scripts untouched', () => {
      const pp = svelteRevealPreprocess();
      const result = runScript(pp, 'let x = 1;');
      expect(result).toBeUndefined();
    });
  });

  describe('markup', () => {
    it('skips files that do not use the reveal action', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div class="plain">hello</div>');
      expect(result).toBeUndefined();
    });

    it('injects sr__hide on an element with no other attributes', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div use:reveal>x</div>');
      expect(result?.code).toContain('class="sr__hide"');
      expect(result?.code).toContain('use:reveal');
    });

    it('injects sr__hide on an element that already has other attributes', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div data-foo="bar" use:reveal>x</div>');
      expect(result?.code).toContain('class="sr__hide"');
      expect(result?.code).toContain('data-foo="bar"');
    });

    it('appends sr__hide to an existing double-quoted class attribute', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div class="foo bar" use:reveal />');
      expect(result?.code).toContain('class="foo bar sr__hide"');
    });

    it('appends sr__hide to an existing single-quoted class attribute', () => {
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
      expect(result?.code ?? input).toBe(input);
      expect((result?.code ?? input).match(/sr__hide/g)?.length).toBe(1);
    });

    it('ignores use:reveal occurrences inside HTML comments', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<!-- <div use:reveal /> --><p>noop</p>');
      expect(result).toBeUndefined();
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

    it('injects a <script> block with the styles import when none exists', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<main><div use:reveal /></main>');
      expect(result?.code).toMatch(/<script>[\s\S]*svelte-reveal\/styles\.css[\s\S]*<\/script>/);
    });

    it('does not inject a <script> block when one already exists', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<script>let x = 1;</script>\n<div use:reveal />');
      const scriptOpens = result?.code.match(/<script(\s|>)/g)?.length ?? 0;
      expect(scriptOpens).toBe(1);
      expect(result?.code).not.toContain(`import 'svelte-reveal/styles.css';`);
    });

    it('returns invalid Svelte source unchanged', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runMarkup(pp, '<div use:reveal');
      expect(result).toBeUndefined();
    });
  });

  describe('script', () => {
    it('injects the styles import for files flagged by markup', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      runMarkup(pp, '<script>let x = 1;</script>\n<div use:reveal />', 'A.svelte');
      const result = runScript(pp, 'let x = 1;', 'A.svelte');
      expect(result?.code).toBe(`import 'svelte-reveal/styles.css';\nlet x = 1;`);
    });

    it('does not inject when markup did not flag the file', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      const result = runScript(pp, 'let x = 1;', 'A.svelte');
      expect(result).toBeUndefined();
    });

    it('does not inject twice when the import already exists', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      runMarkup(pp, `<script>import 'svelte-reveal/styles.css';</script>\n<div use:reveal />`, 'B.svelte');
      const existing = `import 'svelte-reveal/styles.css';`;
      const result = runScript(pp, existing, 'B.svelte');
      expect(result).toBeUndefined();
    });

    it('skips module-context scripts', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      runMarkup(
        pp,
        `<script context="module">export const x = 1;</script>\n<script>let y = 2;</script>\n<div use:reveal />`,
        'C.svelte'
      );
      const moduleResult = runScript(pp, 'export const x = 1;', 'C.svelte', { context: 'module' });
      expect(moduleResult).toBeUndefined();
      const instanceResult = runScript(pp, 'let y = 2;', 'C.svelte');
      expect(instanceResult?.code).toContain(`import 'svelte-reveal/styles.css';`);
    });

    it('only injects once per file', () => {
      const pp = svelteRevealPreprocess({ ssr: true });
      runMarkup(pp, '<script>let x = 1;</script>\n<div use:reveal />', 'D.svelte');
      const first = runScript(pp, 'let x = 1;', 'D.svelte');
      const second = runScript(pp, 'let x = 1;', 'D.svelte');
      expect(first?.code).toContain(`import 'svelte-reveal/styles.css';`);
      expect(second).toBeUndefined();
    });
  });
});
