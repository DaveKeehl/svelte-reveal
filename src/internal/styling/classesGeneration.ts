import seedrandom from 'seedrandom';
import type { IOptions, Transitions } from '../types';
import { addVendors } from './stylesGeneration';
import { getCssRules, getEasing } from './stylesRetrieval';

/**
 * Create a unique CSS class name for the target element.
 * @param ref - An optional reference name that will be prefixed in the class name
 * @param transitionClass - Whether this class will be used to enable transitioning the properties
 * @param transition - The transition name to be prefixed in the class name
 * @returns The final CSS class name to be used
 */
export const createClassNames = (ref: string, transitionClass: boolean, transition: Transitions): string => {
	const tokens = [ref, transitionClass ? 'base' : '', transition];
	const validTokens = tokens.filter((x) => x && x !== '');
	const prefix = `sr__${validTokens.join('__')}__`;
	const seed = document.querySelectorAll('[data-action="reveal"').length;
	const uid = seedrandom(seed.toString())();
	return `${prefix}${uid.toString().slice(2)}`;
};

/**
 * Generate the main CSS for the target element.
 * @param className - The main CSS class of the target element
 * @param options - The options to be used when creating the CSS
 * @returns The main CSS for the target element
 */
export const createMainCss = (className: string, options: Required<IOptions>): string => {
	const { transition } = options;

	return `
		.${className} {
			${getCssRules(transition, options)}
		}
	`;
};

/**
 * Generate the transition CSS for the target element.
 * @param className - The transition CSS class of the target element
 * @param options - The options to be used when creating the CSS
 * @returns The transition CSS for the target element
 */
export const createTransitionCss = (className: string, options: Required<IOptions>) => {
	const { duration, delay, easing, customEasing } = options;

	let styles = `
		display: block;
		width: fit-content;
		transition: all ${duration / 1000}s ${delay / 1000}s ${getEasing(easing, customEasing)};
	`;
	styles = addVendors(styles.trim());

	return `
		.${className} {
			${styles}
		}
	`;
};
