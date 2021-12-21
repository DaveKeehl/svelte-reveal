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
});
