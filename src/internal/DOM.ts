import { config } from './config';
import { createMainCss, createTransitionCss, getUpdatedStyles } from './styling';
import type { IOptions } from './types';
import { clean } from './utils';

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
	markRevealNode(revealNode);
	const mainCss = createMainCss(className, options);
	const transitionCss = createTransitionCss(baseClassName, options);
	const stylesheet = document.querySelector('style[data-action="reveal"]');

	if (stylesheet) {
		const newStyles = getUpdatedStyles(stylesheet.innerHTML, clean(mainCss), clean(transitionCss));
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
 * @param highlightText - The color hex code to be used to color the logs
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
