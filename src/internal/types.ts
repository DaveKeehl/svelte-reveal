/**
 * Object containing options to tweak the behavior of svelte-reveal at the element level.
 */
export interface RevealOptions {
	/**
	 * When set to false, the transition for the target element is disabled.
	 */
	disable?: boolean;
	/**
	 * It enables/disables debugging mode for the target DOM element.
	 * This will log to the console the target DOM element, along with the options and config.
	 *
	 * In order to be able to use this mode, you are required to also set the `ref` property.
	 */
	debug?: boolean;
	/**
	 * When `debug` is set to `true`, you are required to specificy a `ref` string.
	 *
	 * When multiple DOM nodes have debug mode enabled, `ref` strings allow you to
	 * know to which DOM node a console log statement belongs to.
	 */
	ref?: string;
	/**
	 * When set to true, the console logs of the target node are colored,
	 * making it easier to see them among many other logs.
	 */
	highlightLogs?: boolean;
	/**
	 * The color to use to color the console logs when the `highlightLogs` option is also set to true.
	 *
	 * Any valid CSS color can be used here.
	 */
	highlightColor?: string;
	/**
	 * The root element used by the Intersection Observer.
	 */
	root?: IntersectionObserver['root'];
	/**
	 * The root margin property of the Intersection Observer.
	 */
	rootMargin?: IntersectionObserver['rootMargin'];
	/**
	 * The threshold (in percentage from 0.0 to 1.0) property used by the Intersection
	 * Observer to know when its target element is considered visible.
	 */
	threshold?: number;
	/**
	 * The type of transition that is triggered when the target node becomes visible.
	 */
	transition?: Transition;
	/**
	 * When set to true, the node transitions out when out of view, and is revealed again when back in view.
	 *
	 * ⚠️ Be careful not to overuse this option.
	 */
	reset?: boolean;
	/**
	 * How long the transition lasts (in milliseconds).
	 */
	duration?: number;
	/**
	 * How long the transition is delayed (in milliseconds) before being triggered.
	 */
	delay?: number;
	/**
	 * The type of easing function applied to the `transition`.
	 */
	easing?: Easing;
	/**
	 * The individual weights of a custom cubic-bezier curve.
	 * This option is necessary when `easing` is set to `custom`.
	 */
	customEasing?: CustomEasing;
	/**
	 * The starting offset position in pixels on the x-axis of the `"slide"` transition.
	 * If `x` is negative, the element will transition from the left, else from the right.
	 */
	x?: number;
	/**
	 * The starting offset position in pixels on the y-axis of the `"fly"` transition.
	 * If `y` is negative, the element will transition from the top, else from the bottom.
	 */
	y?: number;
	/**
	 * The starting rotation offset in degrees of the `"spin"` transition.
	 * If `rotate` is positive, the element will spin clockwise, else counter-clockwise.
	 */
	rotate?: number;
	/**
	 * The starting opacity value in percentage of any transition.
	 * It can be a number between `0.0` and `1.0`.
	 */
	opacity?: number;
	/**
	 * The starting blur value in pixels of the `"blur"` transition.
	 */
	blur?: number;
	/**
	 * The starting scale value in percentage of the `"scale"` transition.
	 */
	scale?: number;
	/**
	 * Function that gets fired when the node starts being revealed.
	 */
	onRevealStart?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the node is fully revealed.
	 */
	onRevealEnd?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the `reset` option is set to `true`
	 * and the node starts transitioning out.
	 */
	onResetStart?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the `reset` option is set to `true`
	 * and the node has fully transitioned out.
	 */
	onResetEnd?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the node is mounted on the DOM.
	 */
	onMount?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the action options are updated.
	 */
	onUpdate?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the node is unmounted from the DOM.
	 */
	onDestroy?: (node: HTMLElement) => void;
}

/**
 * Object containing the Intersection Observer options.
 */
export interface IObserverOptions {
	/**
	 * The Intersection Observer root element.
	 */
	root: IntersectionObserver['root'];
	/**
	 * The Intersection Observer rootMargin property.
	 */
	rootMargin: IntersectionObserver['rootMargin'];
	/**
	 * The Intersection Observer threshold property.
	 */
	threshold: number;
}

/**
 * List of devices where `string` is the name and `IDevice` are the settings.
 */
export type Devices = [string, IDevice][];

/**
 * Object containing information about a specific type of device.
 */
export interface IDevice {
	/**
	 * Whether the reveal effect is performed on a device.
	 */
	enabled: boolean;
	/**
	 * The viewport width upper limit that a device can be targeted to work in.
	 */
	breakpoint: number;
}

/**
 * The types of devices.
 */
export type Device = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/**
 * Information about how the library handles responsiveness.
 * It can be used to enable/disable the reveal effect on some devices.
 */
export type Responsive = {
	/**
	 * Object containing information about the responsiveness of a device.
	 */
	[P in Device]: IDevice;
};

/**
 * Object containing configuration properties to change the behavior
 * of svelte-reveal on a global level for all instances of this library.
 */
export interface RevealConfig {
	/**
	 * Globally enables/disables all logs.
	 */
	dev: boolean;
	/**
	 * Performs the reveal effect only once when set to `true`.
	 * When set to `true`, refreshing the page doesn't re-run them.
	 */
	once: boolean;
	/**
	 * Information about how the library handles responsiveness.
	 * It can be used to enable/disable the reveal effect on some devices.
	 */
	responsive: Responsive;
}

/**
 * The return type of the Svelte action.
 */
export interface IReturnAction {
	/**
	 * Lifecycle function that is triggered when the action options are updated.
	 */
	update?: () => void;
	/**
	 * Lifecycle function that is triggered when the node is unmounted from the DOM.
	 */
	destroy?: () => void;
}

/**
 * The types of supported transitions.
 */
export type Transition = 'fly' | 'fade' | 'blur' | 'scale' | 'slide' | 'spin';

/**
 * The types of supported easing functions that can be used to tweak the timing of a transition.
 */
export type Easing =
	| 'linear'
	| 'easeInSine'
	| 'easeOutSine'
	| 'easeInOutSine'
	| 'easeInQuad'
	| 'easeOutQuad'
	| 'easeInOutQuad'
	| 'easeInCubic'
	| 'easeOutCubic'
	| 'easeInOutCubic'
	| 'easeInQuart'
	| 'easeOutQuart'
	| 'easeInOutQuart'
	| 'easeInQuint'
	| 'easeOutQuint'
	| 'easeInOutQuint'
	| 'easeInExpo'
	| 'easeOutExpo'
	| 'easeInOutExpo'
	| 'easeInCirc'
	| 'easeOutCirc'
	| 'easeInOutCirc'
	| 'easeInBack'
	| 'easeOutBack'
	| 'easeInOutBack'
	| 'custom';

/**
 * The individual weights of a custom cubic-bezier curve.
 */
export type CustomEasing = [number, number, number, number];
