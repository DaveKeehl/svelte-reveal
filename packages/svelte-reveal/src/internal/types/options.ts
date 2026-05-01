import type { Easing } from './easing.ts';
import type { RevealEvents } from './events.ts';
import type { IntersectionObserverConfig } from './intersection-observer.ts';
import type { RevealTransition } from './transitions.ts';

/**
 * Specifies how a single reveal instance behaves.
 */
export type RevealOptions = Partial<
  IntersectionObserverConfig &
    RevealTransition & { easing: Easing } & RevealEvents & {
      /**
       * A CSS class (or space-separated list of classes) to add to the wrapper
       * element Svelte Reveal creates around the target node. Use it to size or
       * position the wrapper so it does not interfere with the parent's layout
       * (e.g. flex, grid, masonry).
       */
      wrapperClass: string;
    }
>;
