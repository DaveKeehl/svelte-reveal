import { config } from './default/config';
import {
  defaultDebugOptions,
  defaultIntersectionObserverConfig,
  defaultBaseRevealTransition,
  defaultSlideRevealTransition,
  defaultFlyRevealTransition,
  defaultSpinRevealTransition,
  defaultBlurRevealTransition,
  defaultScaleRevealTransition,
  defaultRevealEvents,
  defaultRevealEasing,
  defaultOptions
} from './default/options';
import type { IntersectionObserverConfig } from './types/intersection-observer';
import type { RevealConfig } from './types/config';
import { areOptionsValid } from './validations';
import type { RevealOptions } from './types/options';

/**
 * Removes trailing whitespace, newlines and tabs from a string.
 * @param str The string to be cleaned.
 * @returns The cleaned string.
 */
export const cleanString = (str: string): string =>
  str
    .trim()
    .replace(/[\n|\t]/g, '')
    .replace(/\s(\s+)/g, ' ');

/**
 * Creates a clone of the global configuration used by the library.
 * @returns The configuration clone.
 */
export const getConfigClone = (): RevealConfig => structuredClone(config);

/**
 * Creates an object containing all the options needed to configure an Intersection Observer.
 * @param observerConfig The Intersection Observer config.
 * @returns The provided Intersection Observer config, with default values applied in case of unspecified properties.
 */
export const createObserverConfig = (observerConfig?: IntersectionObserverConfig) => {
  return {
    root: observerConfig?.root || defaultIntersectionObserverConfig.root,
    rootMargin: observerConfig?.rootMargin ?? defaultIntersectionObserverConfig.rootMargin,
    threshold: observerConfig?.threshold ?? defaultIntersectionObserverConfig.threshold
  };
};

/**
 * Overrides the default options values with the ones provided by the user.
 * @param userOptions The options provided by the user.
 * @returns The final options that can be used by the rest of the library.
 */
export const createFinalOptions = (userOptions: RevealOptions): Required<RevealOptions> => {
  let baseOptions: Required<RevealOptions> = defaultOptions;

  const tmp: Required<RevealOptions> = {
    disable: userOptions.disable ?? defaultOptions.disable,
    reset: userOptions.reset ?? defaultOptions.reset,
    duration: userOptions.duration ?? defaultOptions.duration,
    delay: userOptions.delay ?? defaultOptions.delay,
    opacity: userOptions.opacity ?? defaultOptions.opacity,
    transition: userOptions.transition
  };

  if (transition === 'slide') {
    baseOptions = {
      ...defaultOptions,
      ...defaultSlideRevealTransition,
      transition: 'slide'
    };
  }

  if (transition === 'fly') baseOptions = { ...defaultOptions, ...defaultFlyRevealTransition };
  if (transition === 'spin') baseOptions = { ...defaultOptions, ...defaultSpinRevealTransition };
  if (transition === 'blur') baseOptions = { ...defaultOptions, ...defaultBlurRevealTransition };
  if (transition === 'scale') baseOptions = { ...defaultOptions, ...defaultScaleRevealTransition };

  if (!areOptionsValid(baseOptions)) throw new Error('Invalid options');
  return baseOptions;
};
