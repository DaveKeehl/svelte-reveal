import type { IConfig, IOptions, IReturnAction, IObserverOptions, ObserverRoot } from './types';
import { styleTagStore, reloadStore } from './stores';
import { getCssRules, getEasing } from './utils';

export const init: Required<IOptions> = {
	disable: false,
	debug: false,
	ref: '',
	highlightLogs: false,
	highlightColor: 'tomato',
	root: null,
	marginTop: 0,
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	threshold: 0.6,
	transition: 'fly',
	delay: 0,
	duration: 800,
	easing: 'custom',
	customEasing: [0.25, 0.1, 0.25, 0.1],
	x: -20,
	y: -20
};

let config: IConfig = {
	dev: true,
	once: false,
	observer: {
		root: init.root,
		rootMargin: `${init.marginTop}px ${init.marginRight}px ${init.marginBottom}px ${init.marginLeft}px`,
		threshold: init.threshold
	}
};

/**
 * Toggles on/off the development mode.
 * @param dev - The development mode
 */
export const setDev = (dev: boolean): void => {
	config.dev = dev;
};

/**
 * Toggles on/off animations on page reload.
 * @param once - Run on page reload status
 */
export const setOnce = (once: boolean): void => {
	config.once = once;
};

/**
 * Sets the Intersection Observer API configuration.
 * @param observerConfig - Your custom observer config
 */
export const setObserverConfig = (observerConfig: IObserverOptions): void => {
	config.observer = observerConfig;
};

/**
 * Sets the Intersection Observer API root element.
 * @param root - The root element
 */
export const setObserverRoot = (root: ObserverRoot): void => {
	config.observer.root = root;
};

/**
 * Sets the rootMargin property of the Intersection Observer API.
 * @param rootMargin - The margin used by the observer with respect to the root element
 */
export const setObserverRootMargin = (rootMargin: string): void => {
	config.observer.rootMargin = rootMargin;
};

/**
 * Sets the threshold used by the Intersection Observer API to detect when an element is considered visible.
 * @param threshold - The observer threshold value
 */
export const setObserverThreshold = (threshold: number): void => {
	if (threshold >= 0 && threshold <= 1) {
		config.observer.threshold = threshold;
	} else {
		console.error('Threshold must be between 0 and 1');
	}
};

/**
 * Sets all the global configurations (dev, once, observer) used by this library.
 * @param userConfig - Your custom global configurations
 */
export const setConfig = (userConfig: IConfig): void => {
	config = userConfig;
};

/**
 * Reveals a given node element on scroll
 * @param node - The DOM node you want to reveal on scroll
 * @param options - The custom options that will used to tweak the behavior of the animation of the node element
 * @returns An object containing update and/or destroy functions
 */
export const reveal = (node: HTMLElement, options: IOptions = {}): IReturnAction => {
	const {
		disable = init.disable,
		debug = init.debug,
		ref = init.ref,
		highlightLogs = init.highlightLogs,
		highlightColor = init.highlightColor,
		threshold = init.threshold,
		transition = init.transition,
		delay = init.delay,
		duration = init.duration,
		easing = init.easing,
		customEasing = init.customEasing
	} = options;

	node.dispatchEvent(new CustomEvent('mount'));

	const canDebug = config.dev && debug && ref !== '';
	const highlightText = `color: ${highlightLogs ? highlightColor : '#B4BEC8'}`;

	// Logging initial options and configurations info
	if (canDebug) {
		console.groupCollapsed(`%cRef: ${ref}`, highlightText);

		console.groupCollapsed('%cNode', highlightText);
		console.log(node);
		console.groupEnd();

		console.groupCollapsed('%cConfig', highlightText);
		console.log(config);
		console.groupEnd();

		console.groupCollapsed('%cOptions', highlightText);
		console.log(init);
		console.groupEnd();
	}

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
		navigationType = window.performance.navigation.type;
	}
	if (navigationType === 'reload' || navigationType === 1) reloadStore.set(true);

	if (disable || (config.once && reloaded)) return {};

	let styleTagExists = false;
	const unsubscribeStyleTag = styleTagStore.subscribe((value: boolean) => (styleTagExists = value));

	// Creating stylesheet
	if (!styleTagExists) {
		const style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.setAttribute('data-action', 'reveal');
		style.innerHTML = `
		.fly--hidden {
			${getCssRules('fly', options)}
		}
		.fade--hidden {
			${getCssRules('fade')}
		}
		.blur--hidden {
			${getCssRules('blur')}
		}
		.scale--hidden {
			${getCssRules('scale')}
		}
		.slide--hidden {
			${getCssRules('slide', options)}
		}
		.spin--hidden {
			${getCssRules('spin')}
		}
		`;
		const head = document.querySelector('head');
		if (head !== null) head.appendChild(style);
		styleTagStore.set(true);
	}

	node.dispatchEvent(new CustomEvent('revealStart'));
	node.classList.add(`${transition}--hidden`);
	node.style.transition = `all ${duration / 1000}s ${delay / 1000}s ${getEasing(easing, customEasing)}`;

	const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		if (canDebug) {
			const entry = entries[0];
			const entryTarget = entry.target;

			if (entryTarget === node) {
				console.groupCollapsed(`%cRef: ${ref} (Intersection Observer Callback)`, highlightText);
				console.log(entry);
				console.groupEnd();
			}
		}

		entries.forEach((entry) => {
			if (entry.intersectionRatio >= threshold) {
				node.dispatchEvent(new CustomEvent('revealEnd'));
				node.classList.remove(`${transition}--hidden`);
				observer.unobserve(node);
			}
		});
	}, config.observer);

	observer.observe(node);
	console.groupEnd();

	return {
		update() {
			node.dispatchEvent(new CustomEvent('update'));
		},

		destroy() {
			node.dispatchEvent(new CustomEvent('destroy'));
			unsubscribeStyleTag();
			unsubscribeReloaded();
		}
	};
};
