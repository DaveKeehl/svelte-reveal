import { ROOT_MARGIN_REGEX } from './constants';
import type { RevealOptions } from './types';

/**
 * Checks whether a numeric variable is within a specific range.
 * @param property The property to check.
 * @param min The range lower limit.
 * @param max The range upper limit.
 * @returns Whether the variable is within the range.
 */
export const hasValidRange = (property: number, min: number, max: number) => {
  return property >= min && property <= max;
};

/**
 * Checks whether a numeric variable is positive.
 * @param property The property to check.
 * @returns Whether the variable is positive.
 */
export const isPositive = (property: number) => property >= 0;

/**
 * Checks whether a numeric variable is a positive integer.
 * @param property The property to check.
 * @returns Whether the variable is a positive integer.
 */
export const isPositiveInteger = (property: number) => {
  return isPositive(property) && Number.isInteger(property);
};

/**
 * Checks whether the provided options are valid.
 * @param options The options to be checked.
 * @returns Whether the provided options are valid.
 */
export const areOptionsValid = (options: Required<RevealOptions>) => {
  const { threshold, opacity, delay, duration, blur, scale, rootMargin } = options;
  return (
    ROOT_MARGIN_REGEX.test(rootMargin) &&
    hasValidRange(threshold, 0, 1) &&
    hasValidRange(opacity, 0, 1) &&
    isPositive(delay) &&
    isPositive(duration) &&
    isPositive(blur) &&
    isPositive(scale)
  );
};
