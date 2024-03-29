import type { RevealConfig } from '@/types/config.ts';

/**
 * Global configuration for all instances (every `use:reveal` in your code) of this library.
 */
export const config: RevealConfig = {
  once: false,
  responsive: {
    mobile: {
      enabled: true,
      breakpoint: 425
    },
    tablet: {
      enabled: true,
      breakpoint: 768
    },
    laptop: {
      enabled: true,
      breakpoint: 1440
    },
    desktop: {
      enabled: true,
      breakpoint: 2560
    }
  }
};
