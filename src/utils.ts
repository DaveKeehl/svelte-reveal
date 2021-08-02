import type { Transitions, IOptions, Easing, CustomEase } from './types';

/**
 * Decorate a set of CSS rules with browser-vendors prefixes.
 * @param unprefixedStyles - The unprefixed styles
 * @returns The prefixed CSS styles
 */
const addVendors = (unprefixedStyles: string): string => {
	const rules = unprefixedStyles
		.trim()
		.replace(/(\n|\t)/g, '')
		.split(';')
		.slice(0, -1);
	let prefixedStyles = '';

	rules.forEach((rule) => {
		const [property, value] = rule.trim().split(': ');
		const decorated = `
            -webkit-${property}: ${value};
            -ms-${property}: ${value}; 
            ${property}: ${value};`;
		prefixedStyles += decorated;
	});

	return prefixedStyles;
};

/**
 * Get the CSS rules of a given transition.
 * @param transition - The name of the transition
 * @param init - The options default values
 * @param options - The options used by the transition
 * @returns The assembled rules of a given transition
 */
export const getCssRules = (transition: Transitions, init: IOptions, options: IOptions): string => {
	const { x = init.x, y = init.y } = options;

	let styles = '';

	if (transition === 'fly') {
		styles = `
			opacity: 0;
			transform: translateY(${y}px);
		`;
	} else if (transition === 'fade') {
		styles = `
			opacity: 0;
		`;
	} else if (transition === 'blur') {
		styles = `
			opacity: 0;
			filter: blur(16px);
		`;
	} else if (transition === 'scale') {
		styles = `
			opacity: 0;
			transform: scale(0);
		`;
	} else if (transition === 'slide') {
		styles = `
			opacity: 0;
			transform: translateX(${x}px);
		`;
	}

	return addVendors(styles).trim();
};

/**
 * Get a valid CSS easing function
 * @param easing - The easing function to be applied
 * @param customEase - Custom values of cubic-bezier easing function
 * @returns A CSS valid easing function value
 */
export const getEasing = (easing: Easing, customEase: CustomEase): string => {
	let easingText: string = easing;

	if (easing === 'cubic-bezier') {
		easingText = `cubic-bezier(${customEase.join(', ')})`;
	}

	return easingText;
};
