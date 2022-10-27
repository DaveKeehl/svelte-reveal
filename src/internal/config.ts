import type { IOptions, IConfig, IObserverOptions } from './types';
import { createObserverRootMargin } from './utils';

/**
 * Object containing the default options used by the library for the scroll effect.
 */
export const defOpts: Required<IOptions> = {
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
	reset: false,
	delay: 0,
	duration: 800,
	easing: 'custom',
	customEasing: [0.25, 0.1, 0.25, 0.1],
	x: -20,
	y: -20,
	rotate: -360,
	opacity: 0,
	blur: 16,
	scale: 0,
	onRevealStart: () => null,
	onRevealEnd: () => null,
	onResetStart: () => null,
	onResetEnd: () => null,
	onMount: () => null,
	onUpdate: () => null,
	onDestroy: () => null
};

export const observerConfig: IObserverOptions = {
	root: defOpts.root,
	rootMargin: createObserverRootMargin({
		top: defOpts.marginTop,
		right: defOpts.marginRight,
		bottom: defOpts.marginBottom,
		left: defOpts.marginLeft
	}),
	threshold: defOpts.threshold
};

/**
 * Object containing global configurations that apply to all instances of this library.
 */
export const config: IConfig = {
	dev: true,
	once: false,
	responsive: {
		mobile: {
			enabled: true,
			breakpoint: 425
		},
		tablet: {
			enabled: true,
			breakpoint: 768
		},
		laptop: {
			enabled: true,
			breakpoint: 1440
		},
		desktop: {
			enabled: true,
			breakpoint: 2560
		}
	},
	observer: observerConfig
};

/**
 * Overrides the default option values with the ones provided by the user.
 * @param userOptions - The options provided by the user
 * @returns The final options that can be used by the rest of the library
 */
export const createFinalOptions = (userOptions: IOptions): Required<IOptions> => {
	return Object.assign({}, defOpts, userOptions);
};
