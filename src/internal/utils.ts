import type { IOptions, IConfig } from './types';
import { init, config } from './index';
import { getEasing } from './styling';
import { hasValidRange, isPositive } from './validations';

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
 * @param options - The options to be applied to the reveal effect
 * @returns The element to be revealed
 */
export const activateRevealNode = (revealNode: HTMLElement, options: Required<IOptions>): HTMLElement => {
	const { transition, duration, delay, easing, customEasing } = options;

	markRevealNode(revealNode);
	revealNode.classList.add(`${transition}--hidden`);
	revealNode.style.transition = `all ${duration / 1000}s ${delay / 1000}s ${getEasing(easing, customEasing)}`;

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
 * @returns The custom Intersection Observer
 */
export const createObserver = (
	canDebug: boolean,
	highlightText: string,
	revealNode: HTMLElement,
	options: Required<IOptions>
): IntersectionObserver => {
	const { ref, reset, transition, duration, delay, threshold, onResetStart, onResetEnd, onRevealEnd } = options;

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
				revealNode.classList.add(`${transition}--hidden`);
				setTimeout(() => onResetEnd(revealNode), duration + delay);
			} else if (entry.intersectionRatio >= threshold) {
				setTimeout(() => onRevealEnd(revealNode), duration + delay);
				revealNode.classList.remove(`${transition}--hidden`);
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
