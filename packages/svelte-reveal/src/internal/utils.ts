import { config, defOpts } from './config';
import type { IObserverOptions, RevealConfig, RevealOptions } from './types';

/**
 * Deep clones a given item.
 * @param item What needs to be cloned.
 * @returns The cloned item.
 */
export const clone = <T>(item: T): T => JSON.parse(JSON.stringify(item));

/**
 * Removes trailing whitespace, newlines and tabs from a string.
 * @param str The string to be cleaned.
 * @returns The cleaned string.
 */
export const clean = (str: string): string =>
  str
    .trim()
    .replace(/[\n|\t]/g, '')
    .replace(/\s(\s+)/g, ' ');

/**
 * Creates a clone of the global configuration used by the library.
 * @returns The configuration clone.
 */
export const getConfigClone = (): RevealConfig => clone(config);

/**
 * Creates an object containing all the options needed to configure an Intersection Observer.
 * @param observerConfig The Intersection Observer config.
 * @returns The provided Intersection Observer config, with default values applied in case of unspecified properties.
 */
export const createObserverConfig = (observerConfig?: Partial<IObserverOptions>) => {
  return {
    root: observerConfig?.root || defOpts.root,
    rootMargin: observerConfig?.rootMargin || defOpts.rootMargin,
    threshold: observerConfig?.threshold || defOpts.threshold
  };
};

/**
 * Overrides the default options values with the ones provided by the user.
 * @param userOptions The options provided by the user.
 * @returns The final options that can be used by the rest of the library.
 */
export const createFinalOptions = (userOptions: RevealOptions): Required<RevealOptions> => {
  return Object.assign({}, defOpts, userOptions);
};
