import { config } from '@/default/config.ts';
import {
  defaultIntersectionObserverConfig,
  defaultOptions,
  defaultFlyRevealTransition,
  defaultSlideRevealTransition,
  defaultBlurRevealTransition,
  defaultScaleRevealTransition,
  defaultSpinRevealTransition
} from '@/default/options.ts';
import { validateOptions } from '@/validations.ts';
import type { IntersectionObserverConfig } from '@/types/intersection-observer.ts';
import type { RevealConfig } from '@/types/config.ts';
import type { RevealOptions } from '@/types/options.ts';

/**
 * Removes trailing whitespaces, newlines and tabs from a string.
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
export const cloneConfig = (): RevealConfig => structuredClone(config);

/**
 * Creates an object containing all the options needed to configure an Intersection Observer.
 * @param observerConfig The Intersection Observer config.
 * @returns The provided Intersection Observer config, with default values applied in case of unspecified properties.
 */
export const createIntersectionObserverConfig = (observerConfig?: Partial<IntersectionObserverConfig>) => {
  return {
    root: observerConfig?.root ?? defaultIntersectionObserverConfig.root,
    rootMargin: observerConfig?.rootMargin ?? defaultIntersectionObserverConfig.rootMargin,
    threshold: observerConfig?.threshold ?? defaultIntersectionObserverConfig.threshold
  };
};

/**
 * Merges the default options with the ones provided by the user.
 * @param userOptions The options provided by the user.
 * @returns The final merged options that can be used by the rest of the library.
 */
export const mergeOptions = (userOptions: Partial<RevealOptions>): RevealOptions => {
  const cleanUserOptions = Object.fromEntries(Object.entries(userOptions).filter(([, value]) => value !== undefined));

  switch (userOptions.transition) {
    case 'fly': {
      return validateOptions({
        ...defaultOptions,
        ...defaultFlyRevealTransition,
        ...cleanUserOptions
      });
    }
    case 'slide': {
      return validateOptions({
        ...defaultOptions,
        ...defaultSlideRevealTransition,
        ...cleanUserOptions
      });
    }
    case 'blur': {
      return validateOptions({
        ...defaultOptions,
        ...defaultBlurRevealTransition,
        ...cleanUserOptions
      });
    }
    case 'spin': {
      return validateOptions({
        ...defaultOptions,
        ...defaultSpinRevealTransition,
        ...cleanUserOptions
      });
    }
    case 'scale': {
      return validateOptions({
        ...defaultOptions,
        ...defaultScaleRevealTransition,
        ...cleanUserOptions
      });
    }
    case 'fade':
    case undefined: {
      return validateOptions({
        ...defaultOptions,
        ...cleanUserOptions
      });
    }
  }
};
