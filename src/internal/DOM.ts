import { config } from './config';
import { createTransitionPropertiesCSS, createTransitionDeclarationCSS, getUpdatedStyles } from './styling';
import type { IOptions } from './types';
import { clean, createObserverRootMargin } from './utils';

/**
 * Marks a DOM node as part of reveal process.
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
 * @param baseClassName - The CSS class to be used for the target element transitions
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

	const mainCss = createTransitionPropertiesCSS(className, options);
	const transitionCss = createTransitionDeclarationCSS(baseClassName, options);
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
	if (node.style.length === 0) return node;

	const wrapper = document.createElement('div');
	wrapper.appendChild(node);
	return wrapper;
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

	const observerOptions = {
		root: options.root,
		rootMargin: createObserverRootMargin({
			top: options.marginTop,
			right: options.marginRight,
			bottom: options.marginBottom,
			left: options.marginLeft
		}),
		threshold: options.threshold
	};

	return new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		if (canDebug) {
			const entry = entries[0];

			if (!entry) {
				throw new Error('Intersection Observer entry is undefined');
			}

			const entryTarget = entry.target;

			if (entryTarget === revealNode) {
				console.groupCollapsed(`%cRef: ${ref} (Intersection Observer Callback)`, highlightText);
				console.log(entry);
				console.log(observerOptions);
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
	}, observerOptions);
};

/**
 * Logging initial options and configurations info
 * @param finalOptions - The options used to log
 * @param revealNode - The DOM element to be revealed
 * @returns A tuple consisting of canDebug and highlightText
 */
export const logInfo = (finalOptions: Required<IOptions>, revealNode: HTMLElement): [boolean, string] => {
	const { debug, ref, highlightLogs, highlightColor } = finalOptions;

	const canDebug = config.dev && debug && ref !== '';
	const highlightText = `color: ${highlightLogs ? highlightColor : '#B4BEC8'}`;

	if (canDebug) {
		console.groupCollapsed(`%cRef: ${ref}`, highlightText);

		console.groupCollapsed('%cNode', highlightText);
		console.log(revealNode);
		console.groupEnd();

		console.groupCollapsed('%cConfig', highlightText);
		console.log(config);
		console.groupEnd();

		console.groupCollapsed('%cOptions', highlightText);
		console.log(finalOptions);
		console.groupEnd();
	}

	return [canDebug, highlightText];
};
