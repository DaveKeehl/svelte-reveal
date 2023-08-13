import { config } from '../config';
import type { Devices, IDevice, Responsive } from '../types';
import { clean } from '../utils';
import { hasValidBreakpoints } from './breakpoints';

/**
 * Creates the query for a set of devices whose breakpoints are within the range defined by the `start` and `end` breakpoints.
 * @param devices The devices used to generate the queries from.
 * @param previousDevice The (smaller) device right before the range defined by the `start` and `end` breakpoints. In other words: previousDevice --> startDevice (@start) --> endDevice(@end).
 * @param start The breakpoint that starts the range to consider to generate the query.
 * @param end The breakpoint that ends the range to consider to generate the query.
 * @returns The final optimal query to target the devices found within the [`start`-`end`] breakpoints range.
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
 * Generate a set of optimal queries, given a list of supported devices.
 * @param devices The devices to analyze to create the queries from.
 * @returns A list of optimal queries that can be combined together to create a final media query to provide responsiveness to the elements to transition.
 */
const getOptimalQueries = (devices: Devices): string[] => {
  const queries: string[] = [];

  for (let i = 0; i < devices.length; ) {
    const startDevice = devices[i];

    if (!startDevice || !startDevice[1].enabled) {
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
      endDevice = devices[j] || endDevice;
    }

    queries.push(query);
    i = j;
  }

  return queries;
};

/**
 * Decorates a set of CSS rules with media queries.
 * @param styles The CSS rules to be decorated.
 * @param responsive An object containing all the info on how to create the media queries.
 * @returns The CSS ruleset decorated with the media queries generated from the analysis of the `responsive` object.
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
