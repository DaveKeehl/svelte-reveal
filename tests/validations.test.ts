import { createFinalOptions } from '../src/internal/utils';
import type { RevealOptions } from '../src/internal/types';
import { areOptionsValid, hasValidRange, isPositive, isPositiveInteger } from '../src/internal/validations';

test('hasValidRange', () => {
	expect(hasValidRange(100, 0, 200)).toBe(true);
	expect(hasValidRange(0, 0, 0)).toBe(true);
	expect(hasValidRange(100, 101, 150)).toBe(false);
});

test('isPositive', () => {
	expect(isPositive(0)).toBe(true);
	expect(isPositive(5)).toBe(true);
	expect(isPositive(-1)).toBe(false);
});

test('isPositiveInteger', () => {
	expect(isPositiveInteger(5)).toBe(true);
	expect(isPositiveInteger(0)).toBe(true);
	expect(isPositiveInteger(-1)).toBe(false);
	expect(isPositiveInteger(5.5)).toBe(false);
	expect(isPositiveInteger(-5.5)).toBe(false);
});

test('createFinalOptions', () => {
	const userOptions: RevealOptions = {
		transition: 'fly',
		debug: true,
		ref: 'a',
		threshold: 0.2,
		rootMargin: '100px 0 100px 0'
	};
	const options = createFinalOptions(userOptions);

	expect(options.disable).toBe(false);
	expect(options.debug).toBe(true);
	expect(options.ref).toBe('a');
	expect(options.highlightLogs).toBe(false);
	expect(options.highlightColor).toBe('tomato');
	expect(options.root).toBe(null);
	expect(options.rootMargin).toBe('100px 0 100px 0');
	expect(options.threshold).toBe(0.2);
	expect(options.transition).toBe('fly');
	expect(options.reset).toBe(false);
	expect(options.delay).toBe(0);
	expect(options.duration).toBe(800);
	expect(options.easing).toBe('custom');
	expect(options.customEasing).toStrictEqual([0.25, 0.1, 0.25, 0.1]);
	expect(options.x).toBe(-20);
	expect(options.y).toBe(-20);
	expect(options.rotate).toBe(-360);
	expect(options.opacity).toBe(0);
	expect(options.blur).toBe(16);
	expect(options.scale).toBe(0);
});

describe('areOptionsValid', () => {
	test('Should return false when using invalid options', () => {
		const invalidOptions: RevealOptions = {
			threshold: 1.2,
			opacity: 0,
			delay: -200,
			duration: 2000,
			blur: -5,
			scale: 0
		};
		const finalOptions = createFinalOptions(invalidOptions);
		expect(areOptionsValid(finalOptions)).toBe(false);
	});
});
