import type { Transitions, IOptions, Easing, CustomEasing, Responsive, IDevice, IConfig } from './types';
import { init, config } from '../src/index';

/**
 * Deep clone a given data structure.
 * @param item What you want to clone
 * @returns The cloned item
 */
const clone = <T>(item: T): T => JSON.parse(JSON.stringify(item));

/**
 * Get a clone of the global configuration used by the library.
 * @returns The clone of the config
 */
export const getConfigClone = (): IConfig => clone(config);

/**
 * Check whether a given numeric variable is within a specific range.
 * @param property The property to check
 * @param min The bottom limit
 * @param max The upper limit
 * @returns Whether the variable is within the range or not
 */
export const hasValidRange = (property: number, min: number, max: number): boolean => {
	return property >= min && property <= max;
};

/**
 * Checks whether a numeric variable is positive.
 * @param property The property to check
 * @returns Whether the variable is positive or not
 */
export const isPositive = (property: number): boolean => property >= 0;

/**
 * Checks whether a numeric variable is a positive integer.
 * @param property The property to check
 * @returns Whether the variable is a positive integer or not
 */
export const isPositiveInteger = (property: number): boolean => {
	return isPositive(property) && Number.isInteger(property);
};

/**
 * Checks whether the breakpoints overlap.
 * @param responsive An object that instructs the library how to handle responsiveness
 * @returns Whether the breapoints overlap
 */
export const hasOverlappingBreakpoints = (responsive: Responsive): boolean => {
	const { mobile, tablet, laptop, desktop } = responsive;

	const areOverlapping =
		mobile.breakpoint > tablet.breakpoint ||
		tablet.breakpoint > laptop.breakpoint ||
		laptop.breakpoint > desktop.breakpoint;

	return areOverlapping;
};

/**
 * Checks whether the breakpoints are valid or not.
 * @param responsive An object that instructs the library how to handle responsiveness
 * @returns Returns true if the breakpoints are valid, otherwise it throws errors
 */
export const hasValidBreakpoints = (responsive: Responsive): boolean => {
	const breakpoints: number[] = Object.values(responsive).map((device: IDevice) => device.breakpoint);

	// Check if breakpoints are positive integers
	breakpoints.forEach((breakpoint) => {
		if (!isPositiveInteger(breakpoint)) {
			throw new Error('Breakpoints must be positive integers');
		}
	});

	if (hasOverlappingBreakpoints(responsive)) {
		throw new Error("Breakpoints can't overlap");
	}

	return true;
};

/**
 * Removes trailing whitespace, newlines and tabs from a string.
 * @param styles The string to be cleaned
 * @returns The cleaned string
 */
export const clean = (styles: string): string => styles.trim().replace(/(\n|\t)/g, '');

/**
 * Extract the CSS rules of a given style
 * @param styles - The styles to extract the rules from
 * @returns An array of CSS properties
 */
export const extractCssRules = (styles: string): string[] => {
	return clean(styles)
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
 * Decorate a set of CSS rules with configurable media queries.
 * @param styles The CSS rules to be decorated
 * @param responsive The object containing the info about how to create the media queries
 * @returns The decorated CSS ruleset
 */
export const addMediaQueries = (styles: string, responsive: Responsive = config.responsive): string => {
	const devices = Object.entries(responsive);

	// If all devices are enabled, don't create any media query
	if (devices.every(([, settings]) => settings.enabled)) {
		return styles;
	}

	const { mobile, tablet, laptop } = responsive;

	const mediaQueries: { [P: string]: string } = {
		mobile: `(max-width: ${mobile.breakpoint}px)`,
		tablet: `((min-width: ${mobile.breakpoint + 1}px) and (max-width: ${tablet.breakpoint}px))`,
		laptop: `((min-width: ${tablet.breakpoint + 1}px) and (max-width: ${laptop.breakpoint}px))`,
		desktop: `(min-width: ${laptop.breakpoint + 1}px)`
	};

	const activeQueries: string[] = [];

	// Extract queries for enabled devices
	devices.forEach(([device, settings]) => {
		if (settings.enabled) activeQueries.push(mediaQueries[device]);
	});

	const responsiveStyles = `
		@media ${activeQueries.join(', ')} {
			${styles}
		}
	`;

	return clean(responsiveStyles);
};

/**
 * Get the CSS rules of a given transition.
 * @param transition - The name of the transition
 * @param init - The options default values
 * @param options - The options used by the transition
 * @returns The assembled rules of a given transition
 */
export const getCssRules = (transition: Transitions, options: IOptions): string => {
	const { x, y, rotate, opacity, blur, scale } = Object.assign({}, init, options);

	let styles = '';

	if (transition === 'fly') {
		styles = `
			opacity: ${opacity};
			transform: translateY(${y}px);
		`;
	} else if (transition === 'fade') {
		styles = `
			opacity: ${opacity};
		`;
	} else if (transition === 'blur') {
		styles = `
			opacity: ${opacity};
			filter: blur(${blur}px);
		`;
	} else if (transition === 'scale') {
		styles = `
			opacity: ${opacity};
			transform: scale(${scale});
		`;
	} else if (transition === 'slide') {
		styles = `
			opacity: ${opacity};
			transform: translateX(${x}px);
		`;
	} else if (transition === 'spin') {
		styles = `
			opacity: ${opacity};
			transform: rotate(${rotate}deg);
		`;
	} else {
		throw new Error('Invalid CSS class name');
	}

	return addMediaQueries(addVendors(styles), config.responsive);
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
