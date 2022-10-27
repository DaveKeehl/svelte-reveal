import { createClassNames, createStylesheet } from './styling';
import { config, defOpts } from './config';
import { styleTagStore, reloadStore } from './stores';
import type { IOptions, IReturnAction } from './types';
import { getRevealNode, activateRevealNode, createObserver, logInfo } from './DOM';
import { areOptionsValid, createFinalOptions } from './validations';

/**
 * Reveals a given node element on scroll
 * @param node - The DOM node you want to reveal on scroll
 * @param options - The custom options that will be used to tweak the behavior of the animation of the node element
 * @returns An object containing the update and/or destroy functions
 */
export const reveal = (node: HTMLElement, options: IOptions = defOpts): IReturnAction => {
	const finalOptions = createFinalOptions(options);

	if (!areOptionsValid(finalOptions)) {
		throw new Error('Invalid options');
	}

	const { transition, disable, ref, onRevealStart, onMount, onUpdate, onDestroy } = finalOptions;

	const revealNode = getRevealNode(node);
	const className = createClassNames(ref, false, transition); // The CSS class responsible for the animation
	const baseClassName = createClassNames(ref, true, transition); // The CSS class responsible for transitioning the properties

	onMount(revealNode);

	const [canDebug, highlightText] = logInfo(finalOptions, revealNode);

	// Checking if page was reloaded
	let reloaded = false;
	const unsubscribeReloaded = reloadStore.subscribe((value: boolean) => (reloaded = value));
	const navigation = window.performance.getEntriesByType('navigation');

	let navigationType: string | number = '';
	if (navigation.length > 0) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignoreq
		navigationType = navigation[0].type;
	} else {
		// Using deprecated navigation object as a last resort to detect a page reload
		navigationType = window.performance.navigation.type; // NOSONAR
	}
	if (navigationType === 'reload' || navigationType === 1) reloadStore.set(true);
	if (disable || (config.once && reloaded)) return {};

	// Setting up the styles
	let styleTagExists = false;
	const unsubscribeStyleTag = styleTagStore.subscribe((value: boolean) => (styleTagExists = value));

	if (!styleTagExists) {
		createStylesheet();
		styleTagStore.set(true);
	}

	onRevealStart(revealNode);
	activateRevealNode(revealNode, className, baseClassName, finalOptions);

	const ObserverInstance = createObserver(canDebug, highlightText, revealNode, finalOptions, className);
	ObserverInstance.observe(revealNode);

	console.groupEnd();

	return {
		update() {
			onUpdate(revealNode);
		},

		destroy() {
			onDestroy(revealNode);
			unsubscribeStyleTag();
			unsubscribeReloaded();
		}
	};
};
