<script lang="ts">
  import { reveal, type RevealOptions } from 'svelte-reveal';

  const config: Partial<RevealOptions>[] = [
    { transition: 'fade', duration: 2000 },
    { transition: 'fly', y: -80, easing: 'easeOutBack' },
    { transition: 'slide', x: -80, easing: 'easeOutBack' },
    { transition: 'blur', blur: 2, duration: 1000 },
    { transition: 'spin', rotate: 10, duration: 600, easing: 'easeOutCubic' },
    { transition: 'scale', scale: 2 }
  ];
</script>

<main>
  {#each config as element}
    <section>
      <div use:reveal={{ ...element }} class="box">
        <h1>{element.transition} transition</h1>
      </div>
    </section>
  {/each}
</main>

<style>
  :global(body) {
    background: var(--dark);
  }

  :root {
    --white: #ffffff;
    --dark: #0f172a;
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

  .box {
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
