import type { DebugOptions } from './debug.ts';
import type { Easing } from './easing.ts';
import type { RevealEvents } from './events.ts';
import type { IntersectionObserverConfig } from './intersection-observer.ts';
import type { RevealTransition } from './transitions.ts';

/**
 * Object containing options to tweak the behavior of Svelte Reveal at the element level.
 */
export type RevealOptions = DebugOptions &
  IntersectionObserverConfig &
  RevealTransition & { easing: Easing } & RevealEvents;
