import { reveal } from '../src/internal/reveal';
import type { IOptions } from '../src/internal/types';

describe('reveal', () => {
	test('Should throw an error when using invalid options', () => {
		const node = document.createElement('p');
		const invalidOptions: IOptions = {
			threshold: 1.2,
			opacity: 0,
			delay: -200,
			duration: 2000,
			blur: -5,
			scale: 0
		};
		expect(() => reveal(node, invalidOptions)).toThrowError('Invalid options');
	});

	/**
	 * TO BE CONTINUED
	 *
	 * svelte-reveal in order to work needs:
	 * - a stylesheet
	 * - css classes for each type of animation
	 * - each class correctly written with browser vendors and media queries
	 * - the targeted elements receive a css class
	 * - the targeted elements get their new css class taken away
	 */
});
