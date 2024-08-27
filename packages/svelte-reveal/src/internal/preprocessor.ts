import { PreprocessorGroup } from 'svelte/compiler';

export function svelteRevealPreprocess(options?: { ssr?: boolean }): PreprocessorGroup {
  const ssr = options?.ssr ?? false;

  return {
    markup({ content }) {
      if (!ssr) return { code: content };

      const cssClassToAdd = 'sr__hide';
      const regex = /(<[\w-]+\s+[^>]*)(use:reveal)([^>]*>)/g;

      const modifiedContent = content.replace(regex, (match, start, directive, end) => {
        if (/class="[^"]*"/.test(match)) {
          return match.replace(/class="([^"]*)"/, `class="$1 ${cssClassToAdd}"`);
        }
        return `${start}class="${cssClassToAdd}" ${directive}${end}`;
      });

      return { code: modifiedContent };
    },
    script({ content }) {
      if (!ssr) return { code: content };

      const importStatement = `import 'svelte-reveal/styles.css';`;
      const importRegex = /import\s*['"]svelte-reveal\/styles\.css['"]/;

      // If the import already exists, return the content as is
      if (importRegex.test(content)) return { code: content };

      // If the script tag exists, add the import at the top
      if (content.trim().length > 0) return { code: `${importStatement}\n${content}` };

      // If no script tag exists, create one with the import statement
      return { code: `<script>\n${importStatement}\n</script>\n${content}` };
    }
  };
}
