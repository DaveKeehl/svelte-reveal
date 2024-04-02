<script lang="ts">
  import { reveal, type RevealOptions } from 'svelte-reveal';
  import 'svelte-reveal/styles.css';

  const config: RevealOptions[] = [
    { preset: 'fade', duration: 2000 },
    { preset: 'fly', y: -80, easing: 'easeOutBack' },
    { preset: 'slide', x: -80, easing: 'easeOutBack' },
    { preset: 'blur', blur: 2, duration: 1000 },
    { preset: 'spin', rotate: 10, duration: 600, easing: 'easeOutCubic' },
    { preset: 'scale', scale: 2 }
  ];
</script>

<main>
  {#each config as element}
    <section>
      <div use:reveal={{ ...element }} class="wrapper sr__hide">
        <h1>{element.preset} transition</h1>
      </div>
    </section>
  {/each}
</main>

<style>
  :root {
    --white: #ffffff;
    --dark: #0f172a;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(body) {
    background: var(--dark);
  }

  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  section {
    display: grid;
    place-items: center;
    color: var(--white);
    border-bottom: 1px solid color-mix(in srgb, var(--white) 20%, var(--dark) 80%);
    height: 40rem;
    text-transform: capitalize;
    font-size: 2rem;
  }

  .wrapper {
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
