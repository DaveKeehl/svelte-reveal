import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Svelte Reveal',
      social: {
        github: 'https://github.com/davekeehl/svelte-reveal'
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
      ]
    })
  ]
});
