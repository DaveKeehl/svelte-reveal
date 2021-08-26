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
	reveal,
	setDeviceStatus,
	setDeviceBreakpoint,
	setDevice,
	setResponsive,
	setDevicesStatus,
	setDefaultOptions
} from '../src/internal/index';
import type { IConfig, IOptions } from '../src/internal/types';
import { getConfigClone, clone } from '../src/internal/utils';

beforeEach(() => {
	setConfig({
		dev: true,
		once: false,
		responsive: {
			mobile: {
				enabled: true,
				breakpoint: 425
			},
			tablet: {
				enabled: true,
				breakpoint: 768
			},
			laptop: {
				enabled: true,
				breakpoint: 1440
			},
			desktop: {
				enabled: true,
				breakpoint: 2560
			}
		},
		observer: {
			root: null,
			rootMargin: '0px 0px 0px 0px',
			threshold: 0.6
		}
	});
});

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

describe('Testing API', () => {
	describe('setDev', () => {
		test('Should be true by default', () => {
			expect(setDev(config.dev).dev).toBe(true);
		});

		test('Should be false when set to false', () => {
			expect(setDev(false).dev).toBe(false);
		});

		test('Should be true when set to true', () => {
			expect(setDev(true).dev).toBe(true);
		});

		test('Should be false after double assignment (true -> false)', () => {
			setDev(true);
			setDev(false);
			expect(config.dev).toBe(false);
		});
	});

	describe('setOnce', () => {
		test('Should be false by default', () => {
			expect(setOnce(config.once).once).toBe(false);
		});

		test('Should be true when set to true', () => {
			expect(setOnce(true).once).toBe(true);
		});

		test('Should be false when set to false', () => {
			expect(setOnce(false).once).toBe(false);
		});

		test('Should be true after double assignment (false -> true)', () => {
			setOnce(false);
			setOnce(true);
			expect(config.once).toBe(true);
		});
	});

	describe('setDeviceStatus', () => {
		test('Mobile is enabled', () => {
			expect(setDeviceStatus('mobile', true).responsive.mobile.enabled).toBe(true);
		});

		test('Mobile is disabled', () => {
			expect(setDeviceStatus('mobile', false).responsive.mobile.enabled).toBe(false);
		});

		test('Desktop is disabled', () => {
			expect(setDeviceStatus('desktop', false).responsive.desktop.enabled).toBe(false);
		});

		test('Laptop is enabled', () => {
			expect(setDeviceStatus('laptop', true).responsive.laptop.enabled).toBe(true);
		});

		test('Tablet is disabled ', () => {
			expect(setDeviceStatus('tablet', false).responsive.tablet.enabled).toBe(false);
		});
	});

	describe('setDeviceStatus', () => {
		test('No devices provided', () => {
			expect(() => setDevicesStatus([], true)).toThrow('At least one device required');
		});

		test('Mobile is enabled', () => {
			expect(setDevicesStatus(['mobile'], true).responsive.mobile.enabled).toBe(true);
		});

		test('Mobile is disabled', () => {
			expect(setDevicesStatus(['mobile'], false).responsive.mobile.enabled).toBe(false);
		});

		test('Mobile and desktop are disabled', () => {
			expect(setDevicesStatus(['mobile', 'desktop'], false).responsive.mobile.enabled).toBe(false);
			expect(setDevicesStatus(['mobile', 'desktop'], false).responsive.desktop.enabled).toBe(false);
		});

		test('Laptop and tablet are enabled', () => {
			expect(setDevicesStatus(['laptop', 'tablet'], true).responsive.laptop.enabled).toBe(true);
			expect(setDevicesStatus(['laptop', 'tablet'], true).responsive.tablet.enabled).toBe(true);
		});
	});

	describe('setDeviceBreakpoint', () => {
		test('Should throw an error with negative breakpoints', () => {
			expect(() => setDeviceBreakpoint('mobile', -200)).toThrow('Breakpoints must be positive integers');
		});

		test('Should throw an error with floating point breakpoints', () => {
			expect(() => setDeviceBreakpoint('mobile', 400.5)).toThrow('Breakpoints must be positive integers');
		});

		test('Should throw an error when a breakpoint overlaps a smaller device', () => {
			expect(() => setDeviceBreakpoint('tablet', 200)).toThrow("Breakpoints can't overlap");
		});

		test('Correctly overrides a breakpoint when latter is valid', () => {
			expect(setDeviceBreakpoint('laptop', 1200).responsive.laptop.breakpoint).toBe(1200);
		});
	});

	describe('setDevice', () => {
		test('Checking default valid mobile config', () => {
			expect(setDevice('mobile', config.responsive.mobile)).toStrictEqual(config);
		});

		test('Should throw an error when using a floating point breakpoint', () => {
			config.responsive.mobile.breakpoint = 200.5;
			expect(() => setDevice('mobile', config.responsive.mobile)).toThrow('Breakpoints must be positive integers');
		});

		test('Should throw an error when using a negative breakpoint', () => {
			config.responsive.mobile.breakpoint = -200;
			expect(() => setDevice('mobile', config.responsive.mobile)).toThrow('Breakpoints must be positive integers');
		});

		test('Should throw an error when breakpoints make devices overlap', () => {
			config.responsive.tablet.breakpoint = 200;
			expect(() => setDevice('tablet', config.responsive.tablet)).toThrow("Breakpoints can't overlap");
		});
	});

	describe('setResponsive', () => {
		test('Checking default config', () => {
			const defaultConfig: IConfig = getConfigClone();
			expect(setResponsive(defaultConfig.responsive)).toStrictEqual(defaultConfig);
		});

		test('Should throw an error when using a negative breakpoint', () => {
			config.responsive.mobile.breakpoint = -200;
			expect(() => setResponsive(config.responsive)).toThrowError('Breakpoints must be positive integers');
		});

		test('Should throw an error when using a floating point breakpoint', () => {
			config.responsive.mobile.breakpoint = 450.5;
			expect(() => setResponsive(config.responsive)).toThrowError('Breakpoints must be positive integers');
		});

		test('Should throw an error when breakpoints make devices overlap', () => {
			config.responsive.tablet.breakpoint = 200;
			expect(() => setResponsive(config.responsive)).toThrowError("Breakpoints can't overlap");
		});
	});

	describe('setObserverConfig', () => {
		test('Checking default config', () => {
			expect(setObserverConfig(config.observer)).toStrictEqual(config);
		});

		/**
		 * @todo test the root property with invalid value
		 */

		test('Should throw an error when root margin is invalid', () => {
			config.observer.rootMargin = '0px 00px 0px 0px';
			expect(() => setObserverConfig(config.observer)).toThrow('Invalid rootMargin syntax');
		});

		test('Should throw an error when threshold is invalid', () => {
			config.observer.threshold = 1.2;
			expect(() => setObserverConfig(config.observer)).toThrow('Threshold must be between 0.0 and 1.0');
		});
	});

	describe('setObserverRoot', () => {
		test('Checking default config', () => {
			expect(setObserverRoot(null).observer.root).toBe(null);
		});

		test('Correctly updates root when latter is valid', () => {
			const div = document.createElement('div');
			expect(setObserverRoot(div).observer.root).toBe(div);
		});
	});

	describe('setObserverRootMargin', () => {
		test('Updates rootMargin when respecting the regex', () => {
			setObserverRootMargin('0px 5px 50px 500%');
			expect(config.observer.rootMargin).toBe('0px 5px 50px 500%');

			setObserverRootMargin('0px 5px 50px');
			expect(config.observer.rootMargin).toBe('0px 5px 50px');

			setObserverRootMargin('0px 5px');
			expect(config.observer.rootMargin).toBe('0px 5px');

			setObserverRootMargin('0px');
			expect(config.observer.rootMargin).toBe('0px');
		});

		test('Should throw an error when rootMargin is invalid', () => {
			expect(() => setObserverRootMargin('0px 0px 0px 0px 0px')).toThrow('Invalid rootMargin syntax');
			expect(() => setObserverRootMargin('0px 0 0px')).toThrow('Invalid rootMargin syntax');
			expect(() => setObserverRootMargin('')).toThrow('Invalid rootMargin syntax');
			expect(() => setObserverRootMargin('0')).toThrow('Invalid rootMargin syntax');
		});
	});

	describe('setObserverThreshold', () => {
		test('Updates the threshold when the latter is valid', () => {
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
		});

		test('Throws an error when 1 < threshold < 0', () => {
			expect(() => setObserverThreshold(-0.2)).toThrow('Threshold must be between 0.0 and 1.0');
			expect(() => setObserverThreshold(1.5)).toThrow('Threshold must be between 0.0 and 1.0');
		});
	});

	describe('setConfig', () => {
		test('Default config is valid', () => {
			expect(setConfig(config)).toStrictEqual(config);
		});

		describe('responsive', () => {
			test('Invalid when breakpoints are negative', () => {
				config.responsive.mobile.breakpoint = -200;
				expect(() => setConfig(config)).toThrowError('Breakpoints must be positive integers');
			});

			test('Invalid when breakpoints are floating points', () => {
				config.responsive.mobile.breakpoint = 450.5;
				expect(() => setConfig(config)).toThrowError('Breakpoints must be positive integers');
			});

			test('Invalid when breakpoints overlap', () => {
				config.responsive.mobile.breakpoint = 400;
				config.responsive.tablet.breakpoint = 300;
				expect(() => setConfig(config)).toThrowError("Breakpoints can't overlap");
			});
		});

		describe('rootMargin', () => {
			test('Invalid with empty string', () => {
				config.observer.rootMargin = '';
				expect(() => setConfig(config)).toThrow('Invalid rootMargin syntax');
			});

			test('Invalid with missing units', () => {
				config.observer.rootMargin = '0 0 0 0';
				expect(() => setConfig(config)).toThrow('Invalid rootMargin syntax');
			});

			test('Invalid with unknown units', () => {
				config.observer.rootMargin = '0px 0px 0this 0that';
				expect(() => setConfig(config)).toThrow('Invalid rootMargin syntax');
			});
		});

		describe('threshold', () => {
			test('Invalid with negative numbers', () => {
				config.observer.threshold = -1;
				expect(() => setConfig(config)).toThrow('Threshold must be between 0.0 and 1.0');
			});

			test('Invalid with numbers greater than 1', () => {
				config.observer.threshold = 1.5;
				expect(() => setConfig(config)).toThrow('Threshold must be between 0.0 and 1.0');
			});
		});
	});
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
