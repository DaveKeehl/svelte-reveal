import { config, createFinalOptions, defOpts } from './config';
import { hasValidBreakpoints } from './styling';
import { getConfigClone } from './utils';
import { areOptionsValid, hasValidRange } from './validations';
import type { IConfig, Device, IDevice, Responsive, IOptions, IObserverOptions, ObserverRoot } from './types';

/**
 * Toggles on/off the development mode.
 * @param dev - The development mode
 * @returns The config object with the updated dev property
 */
export const setDev = (dev: boolean): IConfig => {
	config.dev = dev;
	return config;
};

/**
 * Toggles on/off animations on page reload.
 * @param once - Run on page reload status
 * @returns The config object with the updated dev property
 */
export const setOnce = (once: boolean): IConfig => {
	config.once = once;
	return config;
};

/**
 * Sets the status of a device.
 * @param device The device to enable/disable
 * @param status The new status
 * @returns The config object with the updated device enabled property
 */
export const setDeviceStatus = (device: Device, status: boolean): IConfig => {
	return setDevicesStatus([device], status);
};

/**
 * Sets the status of multiple devices.
 * @param devices The devices to enabled/disable
 * @param status The new status
 * @returns The config object with the updated devices enabled property
 */
export const setDevicesStatus = (devices: Device[], status: boolean): IConfig => {
	if (devices.length > 0) {
		const uniqueDevices = [...new Set(devices)];
		uniqueDevices.forEach((device) => (config.responsive[device].enabled = status));
		return config;
	}
	throw new Error('At least one device required');
};

/**
 * Sets the breakpoint of a device.
 * @param device The breakpoint device
 * @param breakpoint The new breakpoint
 * @returns The config object with the updated device breakpoint property
 */
export const setDeviceBreakpoint = (device: Device, breakpoint: number): IConfig => {
	const configClone: IConfig = getConfigClone();
	configClone.responsive[device].breakpoint = breakpoint;

	if (!hasValidBreakpoints(configClone.responsive)) {
		throw new Error('Invalid breakpoints');
	}

	config.responsive[device].breakpoint = breakpoint;
	return config;
};

/**
 * Updates the settings of a type of device.
 * @param device The type of device you want its settings to be updated
 * @param settings The new settings
 * @returns The config object with the updated device settings
 */
export const setDevice = (device: Device, settings: IDevice): IConfig => {
	const configClone: IConfig = getConfigClone();
	configClone.responsive[device] = settings;

	if (!hasValidBreakpoints(configClone.responsive)) {
		throw new Error('Invalid breakpoints');
	}

	config.responsive[device] = settings;
	return config;
};

/**
 * Sets the responsive property within the config object.
 * @param responsive An object that instructs the library how to handle responsiveness
 * @returns The config object with the updated responsive property
 */
export const setResponsive = (responsive: Responsive): IConfig => {
	if (!hasValidBreakpoints(responsive)) {
		throw new Error('Invalid breakpoints');
	}

	config.responsive = responsive;
	return config;
};

/**
 * Sets the Intersection Observer API configuration.
 * @param observerConfig - Your custom observer config
 * @returns The config object with the updated dev property
 */
export const setObserverConfig = (observerConfig: IObserverOptions): IConfig => {
	setObserverRoot(observerConfig.root);
	setObserverRootMargin(observerConfig.rootMargin);
	setObserverThreshold(observerConfig.threshold);
	return config;
};

/**
 * Sets the Intersection Observer API root element.
 * @param root - The root element
 * @returns The config object with the updated dev property
 */
export const setObserverRoot = (root: ObserverRoot): IConfig => {
	config.observer.root = root;
	return config;
};

/**
 * Sets the rootMargin property of the Intersection Observer API.
 * @param rootMargin - The margin used by the observer with respect to the root element
 * @returns The config object with the updated dev property
 */
export const setObserverRootMargin = (rootMargin: string): IConfig => {
	const margins = rootMargin
		.trim()
		.split(' ')
		.map((margin) => margin.trim());
	const regex = /^(0|([1-9]\d*))(px|%)$/;
	const hasCorrectUnits = margins.every((margin) => regex.test(margin));

	if (rootMargin === '' || margins.length > 4 || !hasCorrectUnits) {
		throw new SyntaxError('Invalid rootMargin syntax');
	}

	config.observer.rootMargin = margins.join(' ');
	return config;
};

/**
 * Sets the threshold used by the Intersection Observer API to detect when an element is considered visible.
 * @param threshold - The observer threshold value
 * @returns The config object with the updated dev property
 */
export const setObserverThreshold = (threshold: number): IConfig => {
	if (!hasValidRange(threshold, 0, 1)) {
		throw new RangeError('Threshold must be between 0.0 and 1.0');
	}

	config.observer.threshold = threshold;
	return config;
};

/**
 * Sets all the global configurations (dev, once, observer) used by this library.
 * @param userConfig - Your custom global configurations
 * @returns The config object with the updated dev property
 */
export const setConfig = (userConfig: IConfig): IConfig => {
	setDev(userConfig.dev);
	setOnce(userConfig.once);
	setResponsive(userConfig.responsive);
	setObserverConfig(userConfig.observer);
	return config;
};

/**
 * Set the default options to be used for the reveal effect.
 * @param options Your new global options
 * @returns The new full and updated options object
 */
export const setDefaultOptions = (options: IOptions): Required<IOptions> => {
	const validOptions = createFinalOptions(options);

	if (!areOptionsValid(validOptions)) {
		throw new Error('Invalid options');
	}

	return Object.assign(defOpts, validOptions);
};
