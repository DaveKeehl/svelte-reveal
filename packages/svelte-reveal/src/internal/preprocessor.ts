import { parse, VERSION, type PreprocessorGroup } from 'svelte/compiler';

const HIDE_CLASS = 'sr__hide';
const STYLES_IMPORT = `import 'svelte-reveal/styles.css';`;
const STYLES_IMPORT_RE = /import\s*['"]svelte-reveal\/styles\.css['"]/;
const HIDE_CLASS_RE = new RegExp(`(?:^|\\s)${HIDE_CLASS}(?:\\s|$)`);

type Edit = { start: number; end: number; replacement: string };

export function svelteRevealPreprocess(options?: { ssr?: boolean }): PreprocessorGroup {
  const ssr = options?.ssr ?? false;
  const filesNeedingImport = new Set<string>();

  return {
    markup({ content, filename }) {
      if (!ssr) return;
      if (!content.includes('use:reveal')) return;

      let ast: ReturnType<typeof parse>;
      try {
        ast = isSvelte5() ? parse(content, { modern: true }) : parse(content);
      } catch {
        return;
      }

      const root = (ast as { fragment?: unknown; html?: unknown }).fragment ?? (ast as { html?: unknown }).html;
      const edits: Edit[] = [];

      walk(root, (node) => {
        const attrs = node.attributes;
        if (!Array.isArray(attrs)) return;

        const hasReveal = attrs.some(
          (a) => (a?.type === 'Action' || a?.type === 'UseDirective') && a?.name === 'reveal'
        );
        if (!hasReveal) return;

        const classAttr = attrs.find((a) => a?.type === 'Attribute' && a?.name === 'class');

        if (!classAttr) {
          const insertAt = node.start + 1 + String(node.name ?? '').length;
          edits.push({ start: insertAt, end: insertAt, replacement: ` class="${HIDE_CLASS}"` });
          return;
        }

        const edit = computeClassEdit(content, classAttr);
        if (edit) edits.push(edit);
      });

      if (edits.length === 0) return;

      edits.sort((a, b) => b.start - a.start);
      let out = content;
      for (const { start, end, replacement } of edits) {
        out = out.slice(0, start) + replacement + out.slice(end);
      }

      if (STYLES_IMPORT_RE.test(out)) return { code: out };

      if (!/<script(\s|>)/.test(out)) {
        return { code: `<script>\n${STYLES_IMPORT}\n</script>\n${out}` };
      }

      if (filename) filesNeedingImport.add(filename);
      return { code: out };
    },

    script({ content, filename, attributes }) {
      if (!ssr) return;
      if (attributes?.context === 'module') return;
      if (!filename || !filesNeedingImport.has(filename)) return;
      filesNeedingImport.delete(filename);
      if (STYLES_IMPORT_RE.test(content)) return;
      return { code: `${STYLES_IMPORT}\n${content}` };
    }
  };
}

function isSvelte5(): boolean {
  const major = Number.parseInt(String(VERSION ?? ''), 10);
  return Number.isFinite(major) && major >= 5;
}

type AstNode = {
  type?: string;
  start?: number;
  end?: number;
  name?: string;
  attributes?: AstNode[];
  value?: unknown;
  data?: string;
  raw?: string;
  [key: string]: unknown;
};

function walk(node: unknown, visit: (node: AstNode & { start: number; end: number }) => void): void {
  if (!node || typeof node !== 'object') return;
  const n = node as AstNode;
  if (typeof n.start === 'number' && typeof n.end === 'number') {
    visit(n as AstNode & { start: number; end: number });
  }
  for (const key of Object.keys(n)) {
    if (key === 'parent') continue;
    const val = n[key];
    if (Array.isArray(val)) {
      for (const child of val) walk(child, visit);
    } else if (val && typeof val === 'object') {
      walk(val, visit);
    }
  }
}

function computeClassEdit(content: string, classAttr: AstNode): Edit | null {
  if (typeof classAttr.start !== 'number' || typeof classAttr.end !== 'number') return null;

  const eqIdx = content.indexOf('=', classAttr.start);
  if (eqIdx === -1 || eqIdx > classAttr.end) {
    const insertAt = classAttr.end;
    return { start: insertAt, end: insertAt, replacement: '' };
  }

  const valueStart = eqIdx + 1;
  const quoteChar = content[valueStart];

  if (quoteChar === '"' || quoteChar === "'") {
    const closingQuoteIdx = content.indexOf(quoteChar, valueStart + 1);
    if (closingQuoteIdx === -1 || closingQuoteIdx >= classAttr.end) return null;
    const inner = content.slice(valueStart + 1, closingQuoteIdx);
    if (HIDE_CLASS_RE.test(inner)) return null;
    const prefix = inner.length === 0 || /\s$/.test(inner) ? '' : ' ';
    return { start: closingQuoteIdx, end: closingQuoteIdx, replacement: `${prefix}${HIDE_CLASS}` };
  }

  if (quoteChar === '{') {
    const inner = content.slice(valueStart, classAttr.end);
    return { start: valueStart, end: classAttr.end, replacement: `"${inner} ${HIDE_CLASS}"` };
  }

  return null;
}
