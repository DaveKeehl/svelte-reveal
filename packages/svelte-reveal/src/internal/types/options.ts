import type { DebugOptions } from './debug';
import type { Easing } from './easing';
import type { RevealEvents } from './events';
import type { IntersectionObserverConfig } from './intersection-observer';
import type { RevealTransition } from './transitions';

/**
 * Object containing options to tweak the behavior of Svelte Reveal at the element level.
 */
export type RevealOptions = DebugOptions &
  IntersectionObserverConfig &
  RevealTransition & { easing: Easing } & RevealEvents;
