import seedrandom from 'seedrandom';

import type { IOptions, IConfig, Transitions } from './types';
import { init, config } from './index';
import { addMediaQueries, addVendors, getCssRules, getEasing } from './styling';
import { hasValidRange, isPositive } from './validations';

/**
 * Create a unique CSS class name for the target element.
 * @param ref - An optional reference name that will be prefixed in the class name
 * @param transitionClass - Whether this class will be used to enable transitioning the properties
 * @param transition - The transition name to be prefixed in the class name
 * @returns The final CSS class name to be used
 */
export const createCssClass = (ref: string, transitionClass: boolean, transition: Transitions): string => {
	const tokens = [ref, transitionClass ? 'base' : '', transition];
	const validTokens = tokens.filter((x) => x && x !== '');
	const prefix = `sr__${validTokens.join('__')}__`;
	const seed = document.querySelectorAll('[data-action="reveal"').length;
	const uid = seedrandom(seed.toString())();
	return `${prefix}${uid.toString().slice(2)}`;
};

/**
 * Adds a "watermark" to the element to be revealed. It sets the data attribute to "reveal".
 * @param revealNode - The element to be marked
 * @returns The marked element
 */
export const markRevealNode = (revealNode: HTMLElement): HTMLElement => {
	revealNode.setAttribute('data-action', 'reveal');
	return revealNode;
};

/**
 * Activates the reveal effect on the target element.
 * @param revealNode - The element to be revealed
 * @param className - The CSS class to be used for the target element
 * @param options - The options to be applied to the reveal effect
 * @returns The element to be revealed
 */
export const activateRevealNode = (
	revealNode: HTMLElement,
	className: string,
	baseClassName: string,
	options: Required<IOptions>
): HTMLElement => {
	const { transition, duration, delay, easing, customEasing } = options;

	markRevealNode(revealNode);

	const mainCss = `
		.${className} {
			${getCssRules(transition, options)}
		}
	`;

	const tmp = addVendors(`transition: all ${duration / 1000}s ${delay / 1000}s ${getEasing(easing, customEasing)};`);
	const transitionCss = `
		.${baseClassName} {
			${tmp}
		}
	`;

	const stylesheet = document.querySelector('style[data-action="reveal"]');

	if (stylesheet) {
		const styles = stylesheet.innerHTML;
		const newStyles = styles.concat(addMediaQueries(clean(mainCss)).concat(addMediaQueries(clean(transitionCss))));
		stylesheet.innerHTML = newStyles;
		revealNode.classList.add(className);
		revealNode.classList.add(baseClassName);
	}

	return revealNode;
};

/**
 * Get the HTML element to be revealed.
 * @param node - The HTML element passed by the svelte action
 * @returns The element to be revealed
 */
export const getRevealNode = (node: HTMLElement): HTMLElement => {
	let revealNode: HTMLElement;

	if (node.style.length === 0) {
		revealNode = node;
	} else {
		const wrapper = document.createElement('div');
		wrapper.appendChild(node);
		revealNode = wrapper;
	}

	return revealNode;
};

/**
 * Creates a custom Intersection Observer for the reveal effect.
 * @param canDebug - Enables/disabled logging the observer notifications
 * @param highlightText - Whether the logs are colored or not
 * @param revealNode - The HTML node to observe
 * @param options - The reveal options
 * @param className - The CSS class to add/remove from/to the target element
 * @returns The custom Intersection Observer
 */
export const createObserver = (
	canDebug: boolean,
	highlightText: string,
	revealNode: HTMLElement,
	options: Required<IOptions>,
	className: string
): IntersectionObserver => {
	const { ref, reset, duration, delay, threshold, onResetStart, onResetEnd, onRevealEnd } = options;

	return new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		if (canDebug) {
			const entry = entries[0];
			const entryTarget = entry.target;

			if (entryTarget === revealNode) {
				console.groupCollapsed(`%cRef: ${ref} (Intersection Observer Callback)`, highlightText);
				console.log(entry);
				console.groupEnd();
			}
		}

		entries.forEach((entry) => {
			if (reset && !entry.isIntersecting) {
				onResetStart(revealNode);
				revealNode.classList.add(className);
				setTimeout(() => onResetEnd(revealNode), duration + delay);
			} else if (entry.intersectionRatio >= threshold) {
				setTimeout(() => onRevealEnd(revealNode), duration + delay);
				revealNode.classList.remove(className);
				if (!reset) observer.unobserve(revealNode);
			}
		});
	}, config.observer);
};

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
export const clean = (styles: string): string => styles.trim().replace(/[\n|\t]/g, '');

/**
 * Get a clone of the global configuration used by the library.
 * @returns The clone of the config
 */
export const getConfigClone = (): IConfig => clone(config);

/**
 * Checks whether some invalid values are found in the options object passed by the user.
 * @param options The options object specified by the user in the Svelte components
 * @returns The final valid options object that can be used by the reveal function
 */
export const checkOptions = (options: IOptions): Required<IOptions> => {
	const finalOptions = Object.assign({}, init, options);
	const { threshold, opacity, delay, duration, blur, scale } = finalOptions;

	if (
		hasValidRange(threshold, 0, 1) &&
		hasValidRange(opacity, 0, 1) &&
		isPositive(delay) &&
		isPositive(duration) &&
		isPositive(blur) &&
		isPositive(scale)
	) {
		return finalOptions;
	} else {
		throw new Error('Invalid options');
	}
};
