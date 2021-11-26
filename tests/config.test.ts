import { init } from '../src/internal/config';
import { setDefaultOptions } from '../src/internal/API';
import type { IOptions } from '../src/internal/types';
import { clone } from '../src/internal/utils';

test('Checking init values', () => {
	expect(init.disable).toBe(false);
	expect(init.debug).toBe(false);
	expect(init.ref).toBe('');
	expect(init.highlightLogs).toBe(false);
	expect(init.highlightColor).toBe('tomato');
	expect(init.root).toBe(null);
	expect(init.marginTop).toBe(0);
	expect(init.marginBottom).toBe(0);
	expect(init.marginLeft).toBe(0);
	expect(init.marginRight).toBe(0);
	expect(init.threshold).toBe(0.6);
	expect(init.transition).toBe('fly');
	expect(init.reset).toBe(false);
	expect(init.delay).toBe(0);
	expect(init.duration).toBe(800);
	expect(init.easing).toBe('custom');
	expect(init.customEasing).toStrictEqual([0.25, 0.1, 0.25, 0.1]);
	expect(init.x).toBe(-20);
	expect(init.y).toBe(-20);
	expect(init.rotate).toBe(-360);
	expect(init.opacity).toBe(0);
	expect(init.blur).toBe(16);
	expect(init.scale).toBe(0);

	const node = document.createElement('p');
	expect(init.onRevealStart(node)).toBe(null);
	expect(init.onRevealEnd(node)).toBe(null);
	expect(init.onResetStart(node)).toBe(null);
	expect(init.onResetEnd(node)).toBe(null);
	expect(init.onMount(node)).toBe(null);
	expect(init.onUpdate(node)).toBe(null);
	expect(init.onDestroy(node)).toBe(null);
});

describe('setDefaultOptions', () => {
	test('Passing default options should return default options', () => {
		const initOptions = clone(init);
		const newOptions = clone(setDefaultOptions(init));
		expect(newOptions).toStrictEqual(initOptions);
	});

	test('Should throw an error when some options are invalid', () => {
		const invalidOptions: IOptions = {
			blur: -20
		};
		expect(() => setDefaultOptions(invalidOptions)).toThrow('Invalid options');
	});

	test('Passing new valid options override the default ones', () => {
		const newOptions: IOptions = {
			blur: 20,
			x: 50,
			y: 100
		};
		expect(setDefaultOptions(newOptions).blur).toBe(20);
		expect(setDefaultOptions(newOptions).x).toBe(50);
		expect(setDefaultOptions(newOptions).y).toBe(100);
		expect(setDefaultOptions(newOptions).delay).toBe(0);
		expect(Object.keys(setDefaultOptions(newOptions)).length).toBe(30);
	});
});
