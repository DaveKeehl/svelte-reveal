import type { RevealDebugOptions } from './debug';
import type { Responsive } from './devices';
import type { RevealEvents } from './events';
import type { IntersectionObserverConfig } from './intersection-observer';
import type { RevealTransition } from './transitions';

/**
 * Object containing options to tweak the behavior of Svelte Reveal at the element level.
 */
export type RevealOptions = RevealDebugOptions & IntersectionObserverConfig & RevealTransition & RevealEvents;

/**
 * Object containing configuration properties to change the behavior
 * of Svelte Reveal on a global level for all instances of this library.
 */
export interface RevealConfig {
  /**
   * Globally enables/disables all logs.
   */
  dev: boolean;
  /**
   * Performs the reveal effect only once when set to `true`.
   * When set to `true`, refreshing the page doesn't re-run them.
   */
  once: boolean;
  /**
   * Information about how the library handles responsiveness.
   * It can be used to enable/disable the reveal effect on some devices.
   */
  responsive: Responsive;
}
