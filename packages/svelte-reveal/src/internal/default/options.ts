import type { DebugOptions } from '../types/debug.ts';
import type { Easing } from '../types/easing.ts';
import type { RevealEvents } from '../types/events.ts';
import type { IntersectionObserverConfig } from '../types/intersection-observer.ts';
import type { RevealOptions } from '../types/options.ts';
import type {
  BaseRevealTransition,
  SlideRevealTransition,
  FlyRevealTransition,
  SpinRevealTransition,
  BlurRevealTransition,
  ScaleRevealTransition,
  FadeRevealTransition
} from '../types/transitions.ts';
import { customEasingWeights } from './easing.ts';

export const defaultDebugOptions: DebugOptions = {
  debug: false,
  ref: '',
  highlightLogs: false,
  highlightColor: 'color'
};

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
  rotate: -360
};

export const defaultBlurRevealTransition: BlurRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'blur',
  blur: 16
};

export const defaultScaleRevealTransition: ScaleRevealTransition = {
  ...defaultBaseRevealTransition,
  transition: 'scale',
  scale: 0
};

export const defaultRevealEasing: Easing = {
  type: 'custom',
  weights: customEasingWeights
};

export const defaultRevealEvents: RevealEvents = {
  onRevealStart: () => null,
  onRevealEnd: () => null,
  onResetStart: () => null,
  onResetEnd: () => null,
  onMount: () => null,
  onUpdate: () => null,
  onDestroy: () => null
};

export const defaultOptions = {
  ...defaultDebugOptions,
  ...defaultIntersectionObserverConfig,
  ...defaultBaseRevealTransition,
  ...defaultRevealEvents,
  easing: defaultRevealEasing,
  transition: 'fade'
} satisfies RevealOptions;
