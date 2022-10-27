import { createFinalOptions } from '../src/internal/config';
import type { IOptions } from '../src/internal/types';
import { hasValidRange, isPositive, isPositiveInteger } from '../src/internal/validations';

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

test('checkOptions', () => {
	const userOptions: IOptions = {
		transition: 'fly',
		debug: true,
		ref: 'a',
		threshold: 0.2,
		marginBottom: 100,
		marginTop: 100
	};
	const options = createFinalOptions(userOptions);

	expect(options.disable).toBe(false);
	expect(options.debug).toBe(true);
	expect(options.ref).toBe('a');
	expect(options.highlightLogs).toBe(false);
	expect(options.highlightColor).toBe('tomato');
	expect(options.root).toBe(null);
	expect(options.marginTop).toBe(100);
	expect(options.marginBottom).toBe(100);
	expect(options.marginLeft).toBe(0);
	expect(options.marginRight).toBe(0);
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
