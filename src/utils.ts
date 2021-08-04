import type { Transitions, IOptions, Easing, CustomEasing } from './types';
import { init } from '../src/index';

/**
 * Extract the CSS rules of a given style
 * @param styles - The styles to extract the rules from
 * @returns An array of CSS properties
 */
export const extractCssRules = (styles: string): string[] => {
	return styles
		.trim()
		.replace(/(\n|\t)/g, '')
		.split(';')
		.filter((rule) => rule !== '')
		.map((rule) => rule.trim());
};

/**
 * Clean and minify your CSS styles
 * @param styles - The styles to be sanitized
 * @returns The minified and sanitized styles
 */
export const sanitizeStyles = (styles: string): string => {
	return extractCssRules(styles).join('; ').concat('; ');
};

/**
 * Decorate a set of CSS rules with browser-vendors prefixes.
 * @param unprefixedStyles - The unprefixed styles
 * @returns The prefixed CSS styles
 */
export const addVendors = (unprefixedStyles: string): string => {
	const rules = extractCssRules(unprefixedStyles);

	let prefixedStyles = '';

	rules.forEach((rule) => {
		const [property, value] = rule.trim().split(': ');
		prefixedStyles += sanitizeStyles(`
			-webkit-${property}: ${value};
			-ms-${property}: ${value};
			${property}: ${value};
		`);
	});

	return prefixedStyles.trim();
};

/**
 * Get the CSS rules of a given transition.
 * @param transition - The name of the transition
 * @param init - The options default values
 * @param options - The options used by the transition
 * @returns The assembled rules of a given transition
 */
export const getCssRules = (transition: Transitions, options?: IOptions): string => {
	let x: number = init.x;
	let y: number = init.y;
	let deg: number = init.deg;

	if (options !== undefined) {
		if (options.x !== undefined) x = options.x;
		if (options.y !== undefined) y = options.y;
		if (options.deg !== undefined) deg = options.deg;
	}

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
	} else if (transition === 'spin') {
		styles = `
			opacity: 0;
			transform: rotate(${deg}deg);
		`;
	} else {
		throw new Error('Invalid CSS class name');
	}

	return addVendors(styles);
};

/**
 * Get a valid CSS easing function
 * @param easing - The easing function to be applied
 * @param customEase - Custom values of cubic-bezier easing function
 * @returns A CSS valid easing function value
 */
export const getEasing = (easing: Easing, customEasing?: CustomEasing): string => {
	interface IWeight {
		[P: string]: CustomEasing;
	}

	const weightsObj: IWeight = {
		linear: [0, 0, 1, 1],
		easeInSine: [0.12, 0, 0.39, 0],
		easeOutSine: [0.61, 1, 0.88, 1],
		easeInOutSine: [0.37, 0, 0.63, 1],
		easeInQuad: [0.11, 0, 0.5, 0],
		easeOutQuad: [0.5, 1, 0.89, 1],
		easeInOutQuad: [0.45, 0, 0.55, 1],
		easeInCubic: [0.32, 0, 0.67, 0],
		easeOutCubic: [0.33, 1, 0.68, 1],
		easeInOutCubic: [0.65, 0, 0.35, 1],
		easeInQuart: [0.5, 0, 0.75, 0],
		easeOutQuart: [0.25, 1, 0.5, 1],
		easeInOutQuart: [0.76, 0, 0.24, 1],
		easeInQuint: [0.64, 0, 0.78, 0],
		easeOutQuint: [0.22, 1, 0.36, 1],
		easeInOutQuint: [0.83, 0, 0.17, 1],
		easeInExpo: [0.7, 0, 0.84, 0],
		easeOutExpo: [0.16, 1, 0.3, 1],
		easeInOutExpo: [0.87, 0, 0.13, 1],
		easeInCirc: [0.55, 0, 1, 0.45],
		easeOutCirc: [0, 0.55, 0.45, 1],
		easeInOutCirc: [0.85, 0, 0.15, 1],
		easeInBack: [0.36, 0, 0.66, -0.56],
		easeOutBack: [0.34, 1.56, 0.64, 1],
		easeInOutBack: [0.68, -0.6, 0.32, 1.6]
	};

	let weights: CustomEasing = [0, 0, 1, 1];

	if (easing === 'custom' && customEasing !== undefined) {
		weights = customEasing;
	} else if (easing !== 'custom' && Object.keys(weightsObj).includes(easing)) {
		weights = weightsObj[easing];
	} else {
		throw new Error('Invalid easing function');
	}

	return `cubic-bezier(${weights.join(', ')})`;
};
