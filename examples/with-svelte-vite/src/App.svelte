<script lang="ts">
  import { reveal } from 'svelte-reveal';
</script>

<main>
  <h1 use:reveal>Fade Transition</h1>
  <h1 use:reveal={{ transition: 'fly' }}>Fly Transition</h1>
  <h1 use:reveal={{ transition: 'slide' }}>Slide Transition</h1>
  <h1 use:reveal={{ transition: 'blur' }}>Blur Transition</h1>
  <h1 use:reveal={{ transition: 'spin' }}>Spin Transition</h1>
  <h1 use:reveal={{ transition: 'scale', scale: 3 }}>Scale Transition</h1>
</main>
