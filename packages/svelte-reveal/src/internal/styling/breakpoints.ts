import type { Responsive } from '../types/reveal';
import { isPositiveInteger } from '../validations';

/**
 * Checks whether the breakpoints overlap.
 * @param responsive An object that instructs the library how to handle responsiveness for a given set of devices.
 * @returns Whether the breapoints overlap.
 */
export const hasOverlappingBreakpoints = (responsive: Responsive): boolean => {
  const { mobile, tablet, laptop, desktop } = responsive;

  return (
    mobile.breakpoint > tablet.breakpoint ||
    tablet.breakpoint > laptop.breakpoint ||
    laptop.breakpoint > desktop.breakpoint
  );
};

/**
 * Checks whether the breakpoints are valid or not.
 * @param responsive An object that instructs the library how to handle responsiveness for a given set of devices.
 * @returns Whether the breakpoints are valid.
 */
export const hasValidBreakpoints = (responsive: Responsive): boolean => {
  const breakpoints = Object.values(responsive).map((device) => device.breakpoint);

  const breakpointsOverlap = hasOverlappingBreakpoints(responsive);
  const allBreakpointsPositive = breakpoints.every((breakpoint) => isPositiveInteger(breakpoint));

  return !breakpointsOverlap && allBreakpointsPositive;
};
