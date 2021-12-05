import { config } from './config';
import type { IConfig } from './types';

/**
 * Deep clone a given data structure.
 * @param item - What you want to clone
 * @returns The cloned item
 */
export const clone = <T>(item: T): T => JSON.parse(JSON.stringify(item));

/**
 * Removes trailing whitespace, newlines and tabs from a string.
 * @param styles The string to be cleaned
 * @returns The cleaned string
 */
export const clean = (styles: string): string =>
	styles
		.trim()
		.replace(/[\n|\t]/g, '')
		.replace(/\s(\s+)/g, ' ');

/**
 * Get a clone of the global configuration used by the library.
 * @returns The clone of the config
 */
export const getConfigClone = (): IConfig => clone(config);
