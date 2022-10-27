import type { IOptions } from './types';

/**
 * Check whether a given numeric variable is within a specific range.
 * @param property The property to check
 * @param min The bottom limit
 * @param max The upper limit
 * @returns Whether the variable is within the range or not
 */
export const hasValidRange = (property: number, min: number, max: number): boolean => {
	return property >= min && property <= max;
};

/**
 * Checks whether a numeric variable is positive.
 * @param property The property to check
 * @returns Whether the variable is positive or not
 */
export const isPositive = (property: number): boolean => property >= 0;

/**
 * Checks whether a numeric variable is a positive integer.
 * @param property The property to check
 * @returns Whether the variable is a positive integer or not
 */
export const isPositiveInteger = (property: number): boolean => {
	return isPositive(property) && Number.isInteger(property);
};

/**
 * Checks whether some the options contain invalid values.
 * @param options The options to be checked
 * @returns Whether the provided options are valid or not
 */
export const areOptionsValid = (options: Required<IOptions>): boolean => {
	const { threshold, opacity, delay, duration, blur, scale } = options;
	return (
		hasValidRange(threshold, 0, 1) &&
		hasValidRange(opacity, 0, 1) &&
		isPositive(delay) &&
		isPositive(duration) &&
		isPositive(blur) &&
		isPositive(scale)
	);
};
