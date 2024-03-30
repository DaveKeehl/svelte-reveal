import type { Easing } from '@/types/easing.ts';
import type { RevealEvents } from '@/types/events.ts';
import type { IntersectionObserverConfig } from '@/types/intersection-observer.ts';
import type { RevealOptions } from '@/types/options.ts';
import type {
  BaseRevealTransition,
  SlideRevealTransition,
  FlyRevealTransition,
  SpinRevealTransition,
  BlurRevealTransition,
  ScaleRevealTransition,
  FadeRevealTransition
} from '@/types/transitions.ts';

export const defaultIntersectionObserverConfig: IntersectionObserverConfig = {
  root: null,
  rootMargin: '0px 0px 0px 0px',
  threshold: 0.6
};

export const defaultBaseRevealTransition: BaseRevealTransition = {
  disable: false,
  reset: false,
  duration: 800,
  delay: 0,
  opacity: 0
};

export const defaultFadeRevealTransition: FadeRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'fade'
};

export const defaultSlideRevealTransition: SlideRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'slide',
  x: -20
};

export const defaultFlyRevealTransition: FlyRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'fly',
  y: -20
};

export const defaultSpinRevealTransition: SpinRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'spin',
  rotate: -10
};

export const defaultBlurRevealTransition: BlurRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'blur',
  blur: 2
};

export const defaultScaleRevealTransition: ScaleRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'scale',
  scale: 0.8
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
  ...defaultFadeRevealTransition,
  ...defaultRevealEvents,
  easing: defaultRevealEasing
} satisfies RevealOptions;
