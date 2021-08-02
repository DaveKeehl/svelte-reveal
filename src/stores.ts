import { writable } from 'svelte/store';

/**
 * Svelte writable store that keeps track of the creation status of the HTML style tag
 * that contains all the CSS classes that animate the nodes on scroll.
 */
export const createdStyleTag = writable(false);

/**
 * Svelte writable store that keeps track of the page reload status.
 */
export const reloadStore = writable(false);
