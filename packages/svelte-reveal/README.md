![Svelte Reveal](https://raw.githubusercontent.com/DaveKeehl/svelte-reveal/dev/assets/hero.png)

# Svelte Reveal

![npm](https://img.shields.io/npm/v/svelte-reveal) ![npm](https://img.shields.io/npm/dw/svelte-reveal) ![GitHub](https://img.shields.io/github/license/davekeehl/svelte-reveal)

> ⚠️ **This package is no longer maintained**
> Version 1.2.0 is the final release. No further versions will be published and open issues will not be addressed. Read below for context and alternatives.

Svelte Reveal is a library created with the purpose of helping [Svelte](https://svelte.dev/) users add reveal on scroll animations to their web applications in the easiest way possible. This library leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in order to know when to trigger the animations.

## Sunset notice

Svelte Reveal started as a personal side project. I wanted scroll-triggered reveal animations on my own portfolio, wrote a Svelte action to handle it, and figured it might be useful to other people too. It turned out it was — and that was genuinely rewarding.

Over time, though, I drifted away from Svelte and the enthusiasm that originally drove the project faded with it. Rather than let the library continue in an ambiguous state — technically published but quietly stale — I'd rather give it a clear and honest ending.

The Svelte ecosystem has moved on in meaningful ways since Svelte Reveal was first built. Svelte 5 introduced `{@attach}` attachments as the idiomatic successor to `use:` actions, native CSS scroll-driven animations have reached broad browser support, and several libraries now cover this niche with modern foundations. Svelte Reveal hasn't kept pace with these changes, and it would be misleading to present it as a current recommendation.

### What to use instead

Depending on what you need:

- **No dependencies:** [Native CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view) with `animation-timeline: view()`. Zero JavaScript, no library, handles the common fade/translate-on-enter case cleanly.

- **Drop-in library (closest to what Svelte Reveal offered):** [USAL.js](https://github.com/usaljs/usal) with the official [`@usal/svelte`](https://www.npmjs.com/package/@usal/svelte) adapter.

- **Svelte 5-idiomatic, fully typed, no library needed:** Write a small `{@attach}` factory wrapping the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API). This is what Svelte Reveal would look like if written from scratch today.

### Final version

The last stable release is version **1.2.0**, which includes a couple of final bugfixes and a brand new documentation website. If you are currently using Svelte Reveal and it works for your project, 1.2.0 is safe to pin — nothing will change after it.

Thank you to everyone who used the library, filed issues, and left a star. It meant a lot.

## Documentation

You can find full documentation on [svelte-reveal.vercel.app](https://svelte-reveal.vercel.app/).

## Changelog

[CHANGELOG](./CHANGELOG.md)

## License

[MIT](./LICENSE)
