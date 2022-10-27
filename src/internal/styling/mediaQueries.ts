import { config } from '../config';
import type { Devices, IDevice, Responsive } from '../types';
import { clean } from '../utils';
import { hasValidBreakpoints } from './breakpoints';

/**
 * Creates the query of a sequence of consecutive enabled devices.
 * @param devices The devices supported by this library
 * @param previousDevice The device right before the one that starts at the `start` breakpoint
 * @param start The breakpoint that started the sequence of consecutive enabled devices
 * @param end The breakpoint that ended the sequence of consecutive enabled devices
 * @returns The final optimal query
 */
const createQuery = (
	devices: Devices,
	previousDevice: [string, IDevice] | undefined,
	start: number,
	end: number
): string => {
	const smallest = Math.min(...devices.map(([, settings]) => settings.breakpoint));
	const largest = Math.max(...devices.map(([, settings]) => settings.breakpoint));

	if (previousDevice === undefined || start === smallest) {
		return `(max-width: ${end}px)`;
	}

	if (end === largest) {
		return `(min-width: ${previousDevice[1].breakpoint + 1}px)`;
	}

	return `(min-width: ${previousDevice[1].breakpoint + 1}px) and (max-width: ${end}px)`;
};

/**
 * Find a sequence of optimal media queries, given a list of devices.
 * @param devices The devices to be analyzed
 * @returns A list of optimal queries to be combined and use to create responsiveness
 */
const getOptimalQueries = (devices: Devices): string[] => {
	const queries: string[] = [];

	for (let i = 0; i < devices.length; ) {
		const startDevice = devices[i];

		if (!startDevice[1].enabled) {
			i++;
			continue;
		}

		let j = i;
		let query = '';
		let endDevice = startDevice;

		while (j < devices.length && endDevice[1].enabled) {
			const start = startDevice[1].breakpoint;
			const end = endDevice[1].breakpoint;
			const previous = devices[i - 1];
			query = createQuery(devices, previous, start, end);

			j++;
			endDevice = devices[j];
		}

		queries.push(query);
		i = j;
	}

	return queries;
};

/**
 * Decorate a set of CSS rules with configurable media queries.
 * @param styles The CSS rules to be decorated
 * @param responsive The object containing the info about how to create the media queries
 * @returns The decorated CSS ruleset
 */
export const addMediaQueries = (styles: string, responsive: Responsive = config.responsive): string => {
	if (!hasValidBreakpoints(responsive)) {
		throw new Error('Cannot create media queries due to invalid breakpoints');
	}

	const devices: Devices = Object.entries(responsive);
	const allDevicesEnabled = devices.every(([, settings]) => settings.enabled);
	const allDevicesDisabled = devices.every(([, settings]) => !settings.enabled);

	if (allDevicesEnabled) return styles; // If styles are applied to every device, you don't need media queries

	if (allDevicesDisabled) {
		return clean(`
			@media not all {
				${styles}
			}
		`);
	}

	const query = getOptimalQueries(devices).join(', ');

	return clean(`
		@media ${query} {
			${styles}
		}
	`);
};
