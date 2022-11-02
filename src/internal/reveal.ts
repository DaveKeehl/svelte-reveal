import { getRevealClassNames, createStylesheet } from './styling';
import { config, createFinalOptions, defOpts } from './config';
import { isStyleTagCreated, hasPageReloaded } from './stores';
import type { RevealOptions, IReturnAction } from './types';
import { getRevealNode, activateRevealNode, createObserver, logInfo } from './DOM';
import { areOptionsValid } from './validations';

/**
 * Reveals a given node element on scroll
 * @param node - The DOM node you want to reveal on scroll
 * @param options - The custom options that will be used to tweak the behavior of the animation of the node element
 * @returns An object containing the update and/or destroy functions
 */
export const reveal = (node: HTMLElement, options: RevealOptions = defOpts): IReturnAction => {
	const finalOptions = createFinalOptions(options);

	if (!areOptionsValid(finalOptions)) {
		throw new Error('Invalid options');
	}

	const { transition, disable, ref, onRevealStart, onMount, onUpdate, onDestroy } = finalOptions;

	const revealNode = getRevealNode(node);
	const [transitionDeclaration, transitionProperties] = getRevealClassNames(ref, transition);

	onMount(revealNode);

	const [canDebug, highlightText] = logInfo(finalOptions, revealNode);

	// Checking if page was reloaded
	let reloaded = false;
	const unsubscribeReloaded = hasPageReloaded.subscribe((value: boolean) => (reloaded = value));
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
	if (navigationType === 'reload' || navigationType === 1) hasPageReloaded.set(true);
	if (disable || (config.once && reloaded)) return {};

	// Setting up the styles
	let styleTagExists = false;
	const unsubscribeStyleTag = isStyleTagCreated.subscribe((value: boolean) => (styleTagExists = value));

	if (!styleTagExists) {
		createStylesheet();
		isStyleTagCreated.set(true);
	}

	onRevealStart(revealNode);
	activateRevealNode(revealNode, transitionDeclaration, transitionProperties, finalOptions);

	const ObserverInstance = createObserver(canDebug, highlightText, revealNode, finalOptions, transitionDeclaration);
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
