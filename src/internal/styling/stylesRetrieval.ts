import { defOpts } from '../config';
import type { Transition, RevealOptions, Easing, CustomEasing } from '../types';
import { clean } from '../utils';
import { addMediaQueries } from './mediaQueries';
import { addVendorPrefixes } from './stylesGeneration';

/**
 * Merges any existing reveal styles with the new ones for the current DOM node that is being "activated". This process is necessary because one CSS stylesheet is shared among all the elements in the page.
 * @param existingRevealStyles Any existing reveal styles in the Svelte Reveal stylesheet.
 * @param nodeRevealStyles The CSS of the DOM node to be revealed.
 * @returns The merged CSS reveal styles to be used to update the Svelte Reveal stylesheet.
 */
export const mergeRevealStyles = (existingRevealStyles: string, nodeRevealStyles: string): string => {
	const combinedRevealStyles = [getMinifiedStylesFromQuery(existingRevealStyles), nodeRevealStyles].join(' ');
	return addMediaQueries(combinedRevealStyles).trim();
};

/**
 * Extracts and minifies styles nested inside a media query.
 * @param query The media query to extract the styles from.
 * @returns The nested styles.
 */
export const getMinifiedStylesFromQuery = (query: string): string => {
	const cleanQuery = clean(query.trim());
	const isMediaQuery = cleanQuery.startsWith('@media');

	if (!isMediaQuery) return cleanQuery;

	const separator = '<opening_media_query_brace>';
	const queryFromOpeningBrace = cleanQuery.replace(/{/, separator).split(separator)[1];

	if (!queryFromOpeningBrace) {
		throw new Error('Invalid media query');
	}

	const queryContent = queryFromOpeningBrace.slice(0, -1);

	return queryContent.trim();
};

/**
 * Get the transition properties CSS rules of a given transition.
 * @param transition The name of the transition.
 * @param options The options used by the transition.
 * @returns The CSS rules to be used to create the given transition.
 */
export const getTransitionPropertiesCSSRules = (transition: Transition, options: RevealOptions): string => {
	const { x, y, rotate, opacity, blur, scale } = Object.assign({}, defOpts, options);

	const transitions: Record<Transition, string> = {
		fly: `
			opacity: ${opacity};
			transform: translateY(${y}px);
		`,
		fade: `
			opacity: ${opacity};
		`,
		blur: `
			opacity: ${opacity};
			filter: blur(${blur}px);
		`,
		scale: `
			opacity: ${opacity};
			transform: scale(${scale});
		`,
		slide: `
			opacity: ${opacity};
			transform: translateX(${x}px);
		`,
		spin: `
			opacity: ${opacity};
			transform: rotate(${rotate}deg);
		`
	};

	if (!Object.keys(transitions).includes(transition)) {
		throw new Error('Invalid CSS class name');
	}

	const styles = transitions[transition];
	return addVendorPrefixes(styles);
};

/**
 * Creates a valid CSS easing function.
 * @param easing The easing function to be applied.
 * @param customEasing Optional tuple to create a custom cubic-bezier easing function.
 * @returns A valid CSS easing function.
 */
export const getEasingFunction = (easing: Easing, customEasing?: CustomEasing): string => {
	if (easing === 'custom' && customEasing) {
		return `cubic-bezier(${customEasing.join(', ')})`;
	}

	const weights = {
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

	if (easing !== 'custom' && Object.keys(weights).includes(easing)) {
		return `cubic-bezier(${weights[easing].join(', ')})`;
	}

	throw new Error('Invalid easing function');
};
