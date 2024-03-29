import { cleanString } from '@/utils.ts';
import { config } from '@/default/config.ts';
import { hasValidBreakpoints } from '@/validations.ts';
import type { Device, DeviceConfig, Devices, Responsive } from '@/types/devices.ts';

/**
 * Creates the query for a set of devices whose breakpoints are within the range defined by the `start` and `end` breakpoints.
 * @param devices The devices used to generate the queries from.
 * @param start The breakpoint that starts the range to generate the query.
 * @param end The breakpoint that ends the range to generate the query.
 * @param previousDevice The (smaller) device right before the range defined by the `start` and `end` breakpoints. In other words: previousDevice --> startDevice (@start) --> endDevice(@end).
 * @returns The final optimal query to target the devices found within the [`start`-`end`] breakpoints range.
 */
const createQuery = (devices: Devices, start: number, end: number, previousDevice?: [Device, DeviceConfig]): string => {
  const minBreakpoint = Math.min(...devices.map(([, settings]) => settings.breakpoint));
  const maxBreakpoint = Math.max(...devices.map(([, settings]) => settings.breakpoint));

  const maxQuery = `(max-width: ${end}px)`;
  if (previousDevice === undefined || start === minBreakpoint) return maxQuery;

  const minQuery = `(min-width: ${previousDevice[1].breakpoint + 1}px)`;
  if (end === maxBreakpoint) return minQuery;

  return `${minQuery} and ${maxQuery}`;
};

/**
 * Generate a set of optimal queries, given a list of supported devices.
 * @param devices The devices to analyze to create the queries from.
 * @returns A list of optimal queries that can be combined together to create a final media query to provide responsiveness to the elements to transition.
 */
const getOptimalQueries = (devices: Devices): string[] => {
  const queries: string[] = [];
  let i = 0;

  while (i < devices.length) {
    const rangeStartDevice = devices[i]?.[1];

    if (!rangeStartDevice || !rangeStartDevice.enabled) {
      i++;
      continue;
    }

    let j = i;
    let query = '';
    let rangeEndDevice = rangeStartDevice;

    while (j < devices.length && rangeEndDevice.enabled) {
      const start = rangeStartDevice.breakpoint;
      const end = rangeEndDevice.breakpoint;
      const previous = devices[i - 1];
      query = createQuery(devices, start, end, previous);

      j++;
      rangeEndDevice = devices[j]?.[1] || rangeEndDevice;
    }

    queries.push(query);
    i = j;
  }

  return queries;
};

/**
 * Decorates a set of CSS rules with media queries.
 * @param styles The CSS rules to be decorated.
 * @param responsive Object containing all the info on how to create the media queries.
 * @returns The CSS ruleset decorated with the media queries generated from the analysis of the `responsive` object.
 */
export const addMediaQueries = (styles: string, responsive: Responsive = config.responsive): string => {
  if (!hasValidBreakpoints(responsive)) throw new Error('Cannot create media queries due to invalid breakpoints');

  const devices = Object.entries(responsive) as Devices;
  const allDevicesEnabled = devices.every(([, settings]) => settings.enabled);
  const allDevicesDisabled = devices.every(([, settings]) => !settings.enabled);

  if (allDevicesEnabled) return styles; // If styles are applied to every device, you don't need media queries
  if (allDevicesDisabled) return ''; // Erase the styles, since the reveal effect won't run on any device

  const query = getOptimalQueries(devices).join(', ');

  return cleanString(`
		@media ${query} {
			${styles}
		}
	`);
};
