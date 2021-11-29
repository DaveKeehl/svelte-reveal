import type { Responsive, IDevice } from '../types';
import { isPositiveInteger } from '../validations';

/**
 * Checks whether the breakpoints overlap.
 * @param responsive An object that instructs the library how to handle responsiveness
 * @returns Whether the breapoints overlap
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
 * @param responsive An object that instructs the library how to handle responsiveness
 * @returns Returns true if the breakpoints are valid, otherwise it throws errors
 */
export const hasValidBreakpoints = (responsive: Responsive): boolean => {
	const breakpoints: number[] = Object.values(responsive).map((device: IDevice) => device.breakpoint);

	// Check if breakpoints are positive integers
	breakpoints.forEach((breakpoint) => {
		if (!isPositiveInteger(breakpoint)) {
			throw new Error('Breakpoints must be positive integers');
		}
	});

	if (hasOverlappingBreakpoints(responsive)) {
		throw new Error("Breakpoints can't overlap");
	}

	return true;
};
