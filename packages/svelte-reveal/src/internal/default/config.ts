import type { RevealConfig } from '@/types/config.ts';

/**
 * Object containing global configuration that apply to all instances of this library.
 */
export const config: RevealConfig = {
  dev: true,
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
