import type { Responsive } from './devices.ts';

/**
 * Global configuration for all instances of this library.
 */
export interface RevealConfig {
  /**
   * Whether the reveal effect runs only once (i.e. it doesn't re-run on page reload).
   */
  once: boolean;
  /**
   * Specifies how the library handles responsiveness. It can be used to enable/disable the reveal effect on some devices.
   */
  responsive: Responsive;
}
