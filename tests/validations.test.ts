import { hasValidRange, isPositive, isPositiveInteger } from '@core/validations';

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
