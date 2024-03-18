import { config } from './default/config';
import { defaultIntersectionObserverConfig, defaultOptions } from './default/options';
import type { IntersectionObserverConfig } from './types/intersection-observer';
import type { RevealConfig } from './types/config';
import type { RevealOptions } from './types/options';
import { areOptionsValid } from './validations';

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
export const cloneConfig = (): RevealConfig => structuredClone(config);

/**
 * Creates an object containing all the options needed to configure an Intersection Observer.
 * @param observerConfig The Intersection Observer config.
 * @returns The provided Intersection Observer config, with default values applied in case of unspecified properties.
 */
export const createObserverConfig = (observerConfig?: Partial<IntersectionObserverConfig>) => {
  return {
    root: observerConfig?.root ?? defaultIntersectionObserverConfig.root,
    rootMargin: observerConfig?.rootMargin ?? defaultIntersectionObserverConfig.rootMargin,
    threshold: observerConfig?.threshold ?? defaultIntersectionObserverConfig.threshold
  };
};

/**
 * Overrides the default options values with the ones provided by the user.
 * @param userOptions The options provided by the user.
 * @returns The final options that can be used by the rest of the library.
 */
export const createFinalOptions = (userOptions: Partial<RevealOptions>): RevealOptions => {
  const cleanUserOptions = Object.fromEntries(Object.entries(userOptions).filter(([, value]) => value !== undefined));
  const finalOptions = { ...defaultOptions, ...cleanUserOptions };
  if (!areOptionsValid(finalOptions)) throw new Error('Invalid options');

  return finalOptions;
};
