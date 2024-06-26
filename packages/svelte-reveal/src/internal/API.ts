import { config } from '@/default/config.ts';
import { defaultOptions } from '@/default/options.ts';
import { mergeOptions, createIntersectionObserverConfig, cloneConfig } from '@/utils.ts';
import { hasValidBreakpoints, inRange } from '@/validations.ts';
import { ROOT_MARGIN_REGEX } from '@/constants.ts';
import type { RevealConfig } from '@/types/config.ts';
import type { Device, DeviceConfig, Responsive } from '@/types/devices.ts';
import type { IntersectionObserverConfig } from '@/types/intersection-observer.ts';
import type { RevealOptions } from '@/types/options.ts';

/**
 * Sets the value of the global `once` property.
 * @param once Whether the reveal effect runs only once (i.e. it doesn't re-run on page reload).
 * @returns The config object with the updated `once` property,
 */
export const setOnce = (once: boolean): RevealConfig => {
  config.once = once;
  return config;
};

/**
 * Sets the status of a device.
 * @param device The device to enable/disable.
 * @param status The new status for `device`.
 * @returns The config object with the updated `enabled` property.
 */
export const setDeviceStatus = (device: Device, status: boolean): RevealConfig => {
  return setDevicesStatus([device], status);
};

/**
 * Sets the status of multiple devices.
 * @param devices The devices to enabled/disable.
 * @param status The devices' new status.
 * @returns The config object with the updated `enabled` properties.
 */
export const setDevicesStatus = (devices: Device[], status: boolean): RevealConfig => {
  if (devices.length === 0) throw new Error('At least one device required');

  const uniqueDevices = [...new Set(devices)];
  uniqueDevices.forEach((device) => (config.responsive[device].enabled = status));
  return config;
};

/**
 * Sets the breakpoint of a device.
 * @param device The device to update with `breakpoint`.
 * @param breakpoint The new breakpoint for `device`.
 * @returns The config object with the updated `breakpoint` property.
 */
export const setDeviceBreakpoint = (device: Device, breakpoint: number): RevealConfig => {
  const configClone = cloneConfig();
  configClone.responsive[device].breakpoint = breakpoint;

  if (!hasValidBreakpoints(configClone.responsive)) throw new Error('Invalid breakpoints');

  config.responsive[device].breakpoint = breakpoint;
  return config;
};

/**
 * Sets the settings of a device.
 * @param device The device to update with `settings`.
 * @param settings The new settings for `device`.
 * @returns The config object with the updated device settings.
 */
export const setDevice = (device: Device, settings: DeviceConfig): RevealConfig => {
  const configClone = cloneConfig();
  configClone.responsive[device] = settings;

  if (!hasValidBreakpoints(configClone.responsive)) throw new Error('Invalid breakpoints');

  config.responsive[device] = settings;
  return config;
};

/**
 * Updates how responsiveness is handled by the library.
 * @param responsive Object that instructs the library how to handle responsiveness.
 * @returns The config object with the updated `responsive` property.
 */
export const setResponsive = (responsive: Responsive): RevealConfig => {
  if (!hasValidBreakpoints(responsive)) throw new Error('Invalid breakpoints');

  config.responsive = responsive;
  return config;
};

/**
 * Sets the Intersection Observer `root` element.
 * @param root The new Intersection Observer `root` element.
 * @returns The Intersection Obsever configuration with the updated `root` property.
 */
export const setObserverRoot = (root: IntersectionObserver['root']): IntersectionObserverConfig => {
  defaultOptions.root = root;
  return createIntersectionObserverConfig();
};

/**
 * Sets the Intersection Observer `rootMargin` property.
 * @param rootMargin The new `rootMargin` used by the Intersection Observer.
 * @returns The Intersection Observer configuration with the updated `rootMargin` property.
 */
export const setObserverRootMargin = (rootMargin: IntersectionObserver['rootMargin']): IntersectionObserverConfig => {
  const isValidMargin = ROOT_MARGIN_REGEX.test(rootMargin);

  if (!isValidMargin) throw new SyntaxError('Invalid rootMargin syntax');

  defaultOptions.rootMargin = rootMargin;
  return createIntersectionObserverConfig();
};

/**
 * Sets the Intersection Observer `threshold` property.
 * @param threshold The new `threshold` used by the Intersection Observer.
 * @returns The Intersection Observer configuration object with the updated `threshold` property.
 */
export const setObserverThreshold = (threshold: number): IntersectionObserverConfig => {
  if (!inRange(threshold, 0, 1)) throw new RangeError('Threshold must be between 0.0 and 1.0');

  defaultOptions.threshold = threshold;
  return createIntersectionObserverConfig();
};

/**
 * Sets the Intersection Observer configuration.
 * @param observerConfig The new Intersection Observer configuration.
 * @returns The updated configuration used to manage the Intersection Observer behavior.
 */
export const setObserverConfig = (observerConfig: Partial<IntersectionObserverConfig>): IntersectionObserverConfig => {
  const newObserverConfig = createIntersectionObserverConfig(observerConfig);
  setObserverRoot(newObserverConfig.root);
  setObserverRootMargin(newObserverConfig.rootMargin);
  setObserverThreshold(newObserverConfig.threshold);
  return newObserverConfig;
};

/**
 * Updates the library global configuration.
 * @param userConfig The new custom configuration.
 * @returns The updated config object.
 */
export const setConfig = (userConfig: RevealConfig): RevealConfig => {
  setOnce(userConfig.once);
  setResponsive(userConfig.responsive);
  return config;
};

/**
 * Updates the default options to be used for the reveal effect.
 * @param userOptions The new default options.
 * @returns The updated default options.
 */
export const setDefaultOptions = (userOptions: RevealOptions): Required<RevealOptions> => {
  return mergeOptions(userOptions);
};
