<script lang="ts">
  import { reveal, type RevealOptions } from 'svelte-reveal';

  const config: RevealOptions[] = [
    { transition: 'fade', duration: 2000 },
    { transition: 'fly', y: -80, easing: 'easeOutBack' },
    { transition: 'slide', x: -80, easing: 'easeOutBack' },
    { transition: 'blur', duration: 1000 },
    { transition: 'spin', duration: 600, easing: 'easeOutCubic' },
    { transition: 'scale' }
  ];
</script>

<main>
  {#each config as element}
    <section>
      <div use:reveal={{ ...element }} class="wrapper">
        <h1>{element.transition} transition</h1>
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
