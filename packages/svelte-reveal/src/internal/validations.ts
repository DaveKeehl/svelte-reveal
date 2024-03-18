import { ROOT_MARGIN_REGEX } from './constants.ts';
import type { RevealOptions } from './types/options.ts';

/**
 * Checks whether a numeric variable is within a specific range.
 * @param value The property to check.
 * @param min The range lower limit.
 * @param max The range upper limit.
 * @returns Whether the variable is within the range.
 */
export const inRange = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};

/**
 * Checks whether a numeric variable is positive.
 * @param value The property to check.
 * @returns Whether the variable is positive.
 */
export const isPositive = (value: number) => value >= 0;

/**
 * Checks whether a numeric variable is a positive integer.
 * @param value The property to check.
 * @returns Whether the variable is a positive integer.
 */
export const isPositiveInteger = (value: number) => {
  return isPositive(value) && Number.isInteger(value);
};

/**
 * Checks whether the provided options are valid.
 * @param options The options to be checked.
 * @returns Whether the provided options are valid.
 */
export const areOptionsValid = (options: RevealOptions) => {
  const isRootMarginValid = ROOT_MARGIN_REGEX.test(options.rootMargin);
  const isThresholdValid = inRange(options.threshold, 0, 1);
  const isOpacityValid = inRange(options.opacity, 0, 1);
  const isDelayValid = isPositive(options.delay);
  const isDurationValid = isPositive(options.duration);

  const areBaseOptionsValid =
    isRootMarginValid && isThresholdValid && isOpacityValid && isDelayValid && isDurationValid;

  if (options.transition === 'blur') {
    const isBlurValid = options.transition === 'blur' && isPositive(options.blur);
    return areBaseOptionsValid && isBlurValid;
  }

  if (options.transition === 'scale') {
    const isScaleValid = isPositive(options.scale);
    return areBaseOptionsValid && isScaleValid;
  }

  return areBaseOptionsValid;
};
