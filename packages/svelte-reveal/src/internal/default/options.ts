import type { Easing } from '@/types/easing.ts';
import type { RevealEvents } from '@/types/events.ts';
import type { IntersectionObserverConfig } from '@/types/intersection-observer.ts';
import type { RevealOptions } from '@/types/options.ts';
import type { RevealTransition } from '@/types/transitions.ts';

export const defaultIntersectionObserverConfig: IntersectionObserverConfig = {
  root: null,
  rootMargin: '0px 0px 0px 0px',
  threshold: 0.6
};

export const presets = {
  fade: {
    preset: 'fade',
    opacity: 0
  },
  slide: {
    preset: 'slide',
    opacity: 0,
    x: -20
  },
  fly: {
    preset: 'fly',
    opacity: 0,
    y: -20
  },
  spin: {
    preset: 'spin',
    opacity: 0,
    rotate: -10
  },
  blur: {
    preset: 'blur',
    opacity: 0,
    blur: 2
  },
  scale: {
    preset: 'scale',
    opacity: 0,
    scale: 0.8
  }
} as const;

export const defaultRevealTransition: RevealTransition = {
  disable: false,
  reset: false,
  duration: 800,
  delay: 0,
  x: 0,
  y: 0,
  rotate: 0,
  blur: 0,
  scale: 1,
  ...presets['fade']
};

export const defaultRevealEasing: Easing = 'easeInOutCubic';

export const defaultRevealEvents: RevealEvents = {
  onRevealStart: () => null,
  onRevealEnd: () => null,
  onResetStart: () => null,
  onResetEnd: () => null,
  onMount: () => null,
  onUpdate: () => null,
  onDestroy: () => null
};

/**
 * The default options used by the library as fallback in case the user leaves some properties undefined.
 */
export const defaultOptions = {
  ...defaultIntersectionObserverConfig,
  ...defaultRevealTransition,
  ...defaultRevealEvents,
  easing: defaultRevealEasing
} satisfies RevealOptions;
