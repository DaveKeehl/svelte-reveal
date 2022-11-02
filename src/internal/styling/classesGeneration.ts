import seedrandom from 'seedrandom';
import type { RevealOptions, Transitions } from '../types';
import { getCSSRules, getEasing } from './stylesRetrieval';

/**
 * Create a unique CSS class name for the target element.
 * @param ref - An optional reference name that will be prefixed in the class name
 * @param transition - The transition name to be prefixed in the class name
 * @returns A tuple with the final CSS classes in the form of: [transitionDeclaration, transitionProperties]
 */
export const getRevealClassNames = (ref: string, transition: Transitions): [string, string] => {
	const createClassNameTokens = (tokensArray: string[]) =>
		tokensArray
			.filter((token) => token && token !== '')
			.map((token) => token.replace(/\s/g, '-'))
			.join('__');

	const createClassName = (tokens: string, uid: string) => `sr__${tokens}__${uid}`;

	const tokens = {
		transition: [ref, 'transition', transition],
		properties: [ref, 'properties', transition]
	};

	const transitionClassTokens = createClassNameTokens(tokens.transition);
	const propertiesClassTokens = createClassNameTokens(tokens.properties);

	const seed = document.querySelectorAll('[data-action="reveal"]').length.toString();
	const uid = seedrandom(seed)().toString().slice(2);

	const transitionDeclaration = createClassName(transitionClassTokens, uid);
	const transitionProperties = createClassName(propertiesClassTokens, uid);

	return [transitionDeclaration, transitionProperties];
};

/**
 * Generate the CSS rules that declares all the transition properties to transition from.
 * @param className - The main CSS class of the target element
 * @param options - The options to be used when creating the CSS
 * @returns The CSS with the transition properties for the target element
 */
export const createTransitionPropertiesCSS = (className: string, options: Required<RevealOptions>) => {
	const { transition } = options;

	return `
		.${className} {
			${getCSSRules(transition, options)}
		}
	`;
};

/**
 * Generate the transition CSS for the target element.
 * @param className - The transition CSS class of the target element
 * @param options - The options to be used when creating the CSS
 * @returns The transition CSS for the target element
 */
export const createTransitionDeclarationCSS = (className: string, options: Required<RevealOptions>) => {
	const duration = options.duration / 1000;
	const delay = options.delay / 1000;
	const easingFunction = getEasing(options.easing, options.customEasing);

	return `
		.${className} {
			transition: all ${duration}s ${delay}s ${easingFunction};
		}
	`;
};
