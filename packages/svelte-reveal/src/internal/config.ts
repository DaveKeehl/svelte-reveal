import type { RevealOptions, RevealConfig } from './types/reveal';

/**
 * Object containing the default options used by the library for the reveal effect.
 */
export const defOpts: Required<RevealOptions> = {
  disable: false,
  debug: false,
  ref: '',
  highlightLogs: false,
  highlightColor: 'tomato',
  root: null,
  rootMargin: '0px 0px 0px 0px',
  threshold: 0.6,
  transition: 'fly',
  reset: false,
  duration: 800,
  delay: 0,
  easing: 'custom',
  customEasing: [0.25, 0.1, 0.25, 0.1],
  x: -20,
  y: -20,
  rotate: -360,
  opacity: 0,
  blur: 16,
  scale: 0,
  onRevealStart: () => null,
  onRevealEnd: () => null,
  onResetStart: () => null,
  onResetEnd: () => null,
  onMount: () => null,
  onUpdate: () => null,
  onDestroy: () => null
};

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
