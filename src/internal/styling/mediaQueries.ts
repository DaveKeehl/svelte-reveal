import { config } from '../config';
import type { Devices, IDevice, Responsive } from '../types';
import { clean } from '../utils';
import { hasValidBreakpoints } from './breakpoints';

/**
 * Creates the query of a sequence of consecutive enabled devices.
 * @param devices The devices supported by this library
 * @param i The current outer iteration point
 * @param beginning The breakpoint that started the sequence of consecutive enabled devices
 * @param end The breakpoint that ended the sequence of consecutive enabled devices
 * @returns The final optimal query
 */
const createQuery = (devices: Devices, i: number, beginning: number, end: number): string => {
	const smallest = Math.min(...devices.map(([, settings]) => settings.breakpoint));
	const largest = Math.max(...devices.map(([, settings]) => settings.breakpoint));

	let query: string;

	if (beginning === smallest) {
		query = `(max-width: ${end}px)`;
	} else {
		const previous: IDevice = devices[i - 1][1];

		if (end === largest) {
			query = `(min-width: ${previous.breakpoint + 1}px)`;
		} else {
			query = `(min-width: ${previous.breakpoint + 1}px) and (max-width: ${end}px)`;
		}
	}

	return query;
};

/**
 * Find a sequence of optimal media queries, given a list of devices.
 * @param devices The devices to be analyzed
 * @returns A list of optimal queries to be combined and use to create responsiveness
 */
const findOptimalQueries = (devices: Devices): string[] => {
	const queries: string[] = [];
	let i = 0;

	while (i < devices.length) {
		if (devices[i][1].enabled) {
			let j = i;
			let query = '';

			while (j < devices.length && devices[j][1].enabled) {
				const beginning = devices[i][1].breakpoint;
				const end = devices[j][1].breakpoint;

				query = createQuery(devices, i, beginning, end);

				j++;
			}
			queries.push(query);
			i = j;
		} else {
			i++;
		}
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
	const devices: Devices = Object.entries(responsive);

	const allDevicesEnabled = devices.every(([, settings]) => settings.enabled);
	const allDevicesDisabled = devices.every(([, settings]) => !settings.enabled);

	if (allDevicesEnabled) return styles;

	if (allDevicesDisabled) {
		return clean(`
		@media not all {
			${styles}
		}
	`);
	}

	hasValidBreakpoints(responsive);

	return clean(`
		@media ${findOptimalQueries(devices).join(', ')} {
			${styles}
		}
	`);
};
