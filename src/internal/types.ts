/**
 * Object containing options that tweak the behavior of a local svelte-reveal instance.
 */
export interface RevealOptions {
	/**
	 * It enables/disables the transition.
	 */
	disable?: boolean;
	/**
	 * It enables/disables debugging mode for the targeted DOM element.
	 * This will log all options and configs to the console.
	 *
	 * In order to be able to use this mode, you are required to also set the ref property.
	 */
	debug?: boolean;
	/**
	 * When debug is set to true, you are required to specificy a ref string.
	 * When multiple DOM nodes have debug mode enabled, ref strings allow you to
	 * know to which DOM node a console log statement belongs to.
	 */
	ref?: string;
	/**
	 * When set to true the console logs of the target node get colored,
	 * making it easier to see them quicker among many other logs.
	 */
	highlightLogs?: boolean;
	/**
	 * You can use this option to tweak the console logs when highlightLogs is set to true.
	 *
	 * Any valid CSS color can be used here.
	 */
	highlightColor?: string;
	/**
	 * The root element used by the Intersection Observer API.
	 */
	root?: IntersectionObserver['root'];
	/**
	 * Root margin property of the Intersection Observer API.
	 */
	rootMargin?: IntersectionObserver['rootMargin'];
	/**
	 * The threshold (in percentage from 0.0 to 1.0) property used by the Intersection
	 * Observer API to know when its target element is considered visible or not.
	 */
	threshold?: number;
	/**
	 * The animation that will be triggered when your target node becomes visible.
	 */
	transition?: Transition;
	/**
	 * When set to true, the node transitions out when it's out of view from the
	 * Intersection Observer.
	 */
	reset?: boolean;
	/**
	 * The amount of milliseconds (ms) you want a given transition to last.
	 */
	duration?: number;
	/**
	 * The amount of milliseconds (ms) you want to delay a given transition.
	 */
	delay?: number;
	/**
	 * The type of easing function you want to apply to a given element.
	 */
	easing?: Easing;
	/**
	 * The individual weights of a custom cubic-bezier curve.
	 */
	customEasing?: CustomEasing;
	/**
	 * The starting offset position in pixels (px) on the x-axis of the "slide" transition.
	 */
	x?: number;
	/**
	 * The starting offset position in pixels (px) on the y-axis of the "fly" transition.
	 */
	y?: number;
	/**
	 * The starting rotation offset in degrees (deg) you want your node to rotate from when being revealed with the "spin" transition.
	 */
	rotate?: number;
	/**
	 * The starting opacity value in percentage (%) of any transition. It can be a number between 0.0 and 1.0.
	 */
	opacity?: number;
	/**
	 * The starting blur value in pixels (px) of the "blur" transition.
	 */
	blur?: number;
	/**
	 * The starting scale value in percentage (%) of the "scale" transition.
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
	 * Function that gets fired when the reset option is set to true
	 * and the node starts transitioning out.
	 */
	onResetStart?: (node: HTMLElement) => void;
	/**
	 * Function that gets fired when the reset option is set to true
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

export interface IObserverOptions {
	/**
	 * The Intersection Observer API root element.
	 */
	root: IntersectionObserver['root'];
	/**
	 * The Intersection Observer API rootMargin property.
	 */
	rootMargin: IntersectionObserver['rootMargin'];
	/**
	 * The Intersection Observer API threshold property.
	 */
	threshold: number;
}

/**
 * List of devices where {string} is the name and {IDevice} are the settings.
 */
export type Devices = [string, IDevice][];

/**
 * An object containing information about a specific type of device
 */
export interface IDevice {
	/**
	 * Whether the device supports the scroll effect.
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

export type Responsive = {
	/**
	 * Object containing information about the responsiveness of a device.
	 */
	[P in Device]: IDevice;
};

/**
 * Object containing global configurations. They apply to all instances of this library.
 */
export interface RevealConfig {
	/**
	 * Globally enables/disables all logs.
	 */
	dev: boolean;
	/**
	 * Runs the scroll animations only once when set to true.
	 * When set to true, refreshing the page doesn't re-run them.
	 */
	once: boolean;
	/**
	 * Information about how the library should handle responsiveness.
	 * It can be used to enable/disable the scroll effect on some devices.
	 */
	responsive: Responsive;
}

/**
 * The return type of the Svelte action.
 */
export interface IReturnAction {
	update?: (options?: RevealOptions) => void;
	destroy?: () => void;
}

/**
 * The animations that can be used by the library users.
 */
export type Transition = 'fly' | 'fade' | 'blur' | 'scale' | 'slide' | 'spin';

/**
 * The easing functions that can be specified by the user to tweak the animation timing.
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
