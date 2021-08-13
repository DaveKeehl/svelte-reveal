import {
	init,
	config,
	setDev,
	setOnce,
	setObserverConfig,
	setObserverRoot,
	setObserverRootMargin,
	setObserverThreshold,
	setConfig,
	checkOptions,
	reveal
} from '../src/index';
import type { IConfig, IObserverOptions, IOptions } from '../src/types';

describe('Testing API correctness', () => {
	test('setDev', () => {
		setDev(false);
		expect(config.dev).toBe(false);

		setDev(true);
		expect(config.dev).toBe(true);

		setDev(true);
		setDev(false);
		expect(config.dev).toBe(false);
	});

	test('setOnce', () => {
		setOnce(true);
		expect(config.once).toBe(true);

		setOnce(false);
		expect(config.once).toBe(false);

		setOnce(false);
		setOnce(true);
		expect(config.once).toBe(true);
	});

	test('setObserverConfig', () => {
		const validConfig: IObserverOptions = {
			root: null,
			rootMargin: `0px 0px 0px 0px`,
			threshold: 1.0
		};
		setObserverConfig(validConfig);
		expect(config.observer).toStrictEqual(validConfig);

		/**
		 * @todo test the root property with invalid value
		 */

		const invalidRootMarginConfig: IObserverOptions = {
			root: null,
			rootMargin: `0px 00px 0px 0px`,
			threshold: 1.0
		};
		expect(() => setObserverConfig(invalidRootMarginConfig)).toThrow('Invalid rootMargin syntax');

		const invalidThresholdConfig: IObserverOptions = {
			root: null,
			rootMargin: `0px 0px 0px 0px`,
			threshold: 1.2
		};
		expect(() => setObserverConfig(invalidThresholdConfig)).toThrow('Threshold must be between 0.0 and 1.0');
	});

	test('setObserverRoot', () => {
		setObserverRoot(null);
		expect(config.observer.root).toBe(null);

		const div = document.createElement('div');
		setObserverRoot(div);
		expect(config.observer.root).toBe(div);
	});

	test('setObserverRootMargin', () => {
		setObserverRootMargin('0px 5px 50px 500%');
		expect(config.observer.rootMargin).toBe('0px 5px 50px 500%');

		setObserverRootMargin('0px 5px 50px');
		expect(config.observer.rootMargin).toBe('0px 5px 50px');

		setObserverRootMargin('0px 5px');
		expect(config.observer.rootMargin).toBe('0px 5px');

		setObserverRootMargin('0px');
		expect(config.observer.rootMargin).toBe('0px');

		expect(() => setObserverRootMargin('0px 0px 0px 0px 0px')).toThrow('Invalid rootMargin syntax');
		expect(() => setObserverRootMargin('0px 0 0px')).toThrow('Invalid rootMargin syntax');
		expect(() => setObserverRootMargin('')).toThrow('Invalid rootMargin syntax');
		expect(() => setObserverRootMargin('0')).toThrow('Invalid rootMargin syntax');
	});

	test('setObserverThreshold', () => {
		setObserverThreshold(1);
		expect(config.observer.threshold).toBe(1);

		setObserverThreshold(1.0);
		expect(config.observer.threshold).toBeCloseTo(1.0);

		setObserverThreshold(0);
		expect(config.observer.threshold).toBe(0);

		setObserverThreshold(0.0);
		expect(config.observer.threshold).toBeCloseTo(0.0);

		setObserverThreshold(0.5);
		expect(config.observer.threshold).toBeCloseTo(0.5);

		expect(() => setObserverThreshold(-0.2)).toThrow('Threshold must be between 0.0 and 1.0');
		expect(() => setObserverThreshold(1.5)).toThrow('Threshold must be between 0.0 and 1.0');
	});

	describe('setConfig', () => {
		const validConfig: IConfig = {
			dev: false,
			once: true,
			observer: {
				root: null,
				rootMargin: '0px 0px 0px 0px',
				threshold: 0.75
			}
		};
		setConfig(validConfig);
		expect(config).toStrictEqual(validConfig);

		const invalidConfig: IConfig = {
			dev: false,
			once: true,
			observer: {
				root: null,
				rootMargin: '',
				threshold: 0.75
			}
		};
		expect(() => setConfig(invalidConfig)).toThrow('Invalid rootMargin syntax');
	});
});

test('Test initial options values', () => {
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

test('Validating the checkOptions function', () => {
	const validOptions: IOptions = {
		threshold: 0.6,
		opacity: 0,
		delay: 200,
		duration: 2000,
		blur: 16,
		scale: 0
	};
	const finalOptions = Object.assign({}, init, validOptions);
	expect(checkOptions(validOptions)).toStrictEqual(finalOptions);

	const invalidOptions: IOptions = {
		threshold: 1.2,
		opacity: 0,
		delay: -200,
		duration: 2000,
		blur: -5,
		scale: 0
	};
	expect(() => checkOptions(invalidOptions)).toThrowError('Invalid options');
});

describe('Checking the reveal function', () => {
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

	// TO BE CONTINUED
});
