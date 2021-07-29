import type { IConfig, IOptions, IReturnAction, IObserverOptions, ObserverRoot } from './index.d';
import { createdStyleTag, reloadStore } from './stores';
import { getCssProperties, printRef, getEasing } from './utils';

const init: Required<IOptions> = {
	disable: false,
	debug: false,
	ref: '',
	root: null,
	marginTop: 0,
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	threshold: 0.6,
	transition: 'fly',
	delay: 0,
	duration: 800,
	easing: 'ease',
	customEase: [0.8, 0, 0.2, 1],
	x: -20,
	y: -20
};

let config: IConfig = {
	disableDebug: false,
	once: false,
	observer: {
		root: init.root,
		rootMargin: `${init.marginTop}px ${init.marginRight}px ${init.marginBottom}px ${init.marginLeft}px`,
		threshold: init.threshold
	}
};

export const setDisableDebug = (debug: boolean): void => {
	config.disableDebug = debug;
};

export const setObserverConfig = (observerConfig: IObserverOptions): void => {
	config.observer = observerConfig;
};

export const setObserverRoot = (root: ObserverRoot): void => {
	config.observer.root = root;
};

export const setObserverRootMargin = (rootMargin: string): void => {
	config.observer.rootMargin = rootMargin;
};

export const setObserverThreshold = (threshold: number): void => {
	if (threshold >= 0 && threshold <= 1) {
		config.observer.threshold = threshold;
	} else {
		console.error('Threshold must be between 0 and 1');
	}
};

export const setOnce = (once: boolean): void => {
	config.once = once;
};

export const setConfig = (userConfig: IConfig): void => {
	config = userConfig;
};

export const reveal = (node: HTMLElement, options: IOptions = {}): IReturnAction | void => {
	const { disable, debug, ref, threshold, transition, delay, duration, easing, customEase } = Object.assign(
		init,
		options
	);

	const canDebug = !config.disableDebug && debug && ref !== '';

	// Logging initial options and configurations info
	if (canDebug) {
		console.log(`DISABLE_DEBUG: ${config.disableDebug}`);
		console.log(`ONCE: ${config.once}`);
		printRef(ref);
		console.log(node);
		console.log(options);
		printRef(ref);
		console.log(config);
	}

	let reloaded = false;
	const unsubscribeReloaded = reloadStore.subscribe((value: boolean) => (reloaded = value));

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignoreq
	const navigationType = window.performance.getEntriesByType('navigation')[0].type;
	if (navigationType === 'reload') reloadStore.set(true);

	if (disable || (config.once && reloaded)) return;

	let styleTagExists = false;
	const unsubscribeStyleTag = createdStyleTag.subscribe((value: boolean) => (styleTagExists = value));

	// Creating stylesheet
	if (!styleTagExists) {
		const style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.setAttribute('data-action', 'reveal');
		style.innerHTML = `
		.fly--hidden {
			${getCssProperties('fly', init, options).trim()}
		}
		.fade--hidden {
			${getCssProperties('fade', init, options).trim()}
		}
		.blur--hidden {
			${getCssProperties('blur', init, options).trim()}
		}
		.scale--hidden {
			${getCssProperties('scale', init, options).trim()}
		}
		.slide--hidden {
			${getCssProperties('slide', init, options).trim()}
		}
		`;
		const head = document.querySelector('head');
		if (head !== null) head.appendChild(style);
		createdStyleTag.set(true);
	}

	node.classList.add(`${transition}--hidden`);
	node.style.transition = `all ${duration / 1000}s ${delay / 1000}s ${getEasing(easing, customEase)}`;

	const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		if (canDebug) {
			const entry = entries[0];
			const entryTarget = entry.target;

			if (entryTarget === node) {
				printRef(ref);
				console.log(entry);
			}
		}

		entries.forEach((entry) => {
			if (entry.intersectionRatio >= threshold) {
				node.classList.remove(`${transition}--hidden`);
				observer.unobserve(node);
			}
		});
	}, config.observer);

	observer.observe(node);

	return {
		destroy() {
			unsubscribeStyleTag();
			unsubscribeReloaded();
		}
	};
};
