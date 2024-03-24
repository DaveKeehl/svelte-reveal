<script lang="ts">
  import { onMount } from 'svelte';
  import { reveal } from 'svelte-reveal';

  let show = false;

  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <h1 use:reveal>Welcome to SvelteKit</h1>
  <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}
