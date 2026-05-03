import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://svelte-reveal.vercel.app',
  integrations: [
    starlight({
      title: 'Svelte Reveal',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/davekeehl/svelte-reveal'
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/davekeehl/svelte-reveal/edit/main/docs/'
      },
      sidebar: [
        {
          label: 'Start Here',
          autogenerate: { directory: 'start-here' }
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' }
        }
      ],
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/custom.css'
      ],
      components: {
        PageFrame: './src/components/PageFrame.astro'
      }
    })
  ]
});
