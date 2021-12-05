import { init } from '../config';
import type { Transitions, IOptions, Easing, CustomEasing } from '../types';
import { clean } from '../utils';
import { addMediaQueries } from './mediaQueries';
import { addVendors } from './stylesGeneration';

/**
 * Get the new updated styles to work both on the previously activated elements and the currently target element.
 * @param oldStyles - The previous styles present in the stylesheet
 * @param mainCss - The name of the main CSS class of the current target element
 * @param transitionCss - The name of the CSS class used for the transitioning of the current target element
 * @returns The final updated styles to be injected into the stylesheet
 */
export const getUpdatedStyles = (oldStyles: string, mainCss: string, transitionCss: string): string => {
	const prevStyles = getMinifiedStylesFromQuery(oldStyles);
	const newStyles = clean([mainCss, transitionCss].join(' '));
	const decorated = addMediaQueries([prevStyles, newStyles].join(' '));
	return decorated.trim();
};

/**
 * Extracts and minifies styles nested inside a media query.
 * @param query - The query to extract the styles from
 * @returns The nested styles
 */
export const getMinifiedStylesFromQuery = (query: string): string => {
	const cleaned = clean(query.trim());
	if (cleaned === '' || !cleaned.startsWith('@media')) return cleaned;
	return clean(cleaned.replace(/{/, '___').split('___')[1].slice(0, -1).trim());
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

	let weights: CustomEasing;

	if (easing === 'custom' && customEasing !== undefined) {
		weights = customEasing;
	} else if (easing !== 'custom' && Object.keys(weightsObj).includes(easing)) {
		weights = weightsObj[easing];
	} else {
		throw new Error('Invalid easing function');
	}

	return `cubic-bezier(${weights.join(', ')})`;
};
