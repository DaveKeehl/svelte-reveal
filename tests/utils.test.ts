import type { CustomEasing, IOptions, Responsive, Transitions } from '../src/types';
import {
	addVendors,
	clean,
	addMediaQueries,
	getEasing,
	sanitizeStyles,
	getCssRules,
	hasValidRange,
	isPositive,
	isPositiveInteger,
	hasOverlappingBreakpoints,
	hasValidBreakpoints,
	getConfigClone
} from '../src/utils';
import { init } from '../src/index';

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

test('hasOverlappingBreakpoints', () => {
	const defaultResponsive = getConfigClone().responsive;
	expect(hasOverlappingBreakpoints(defaultResponsive)).toBe(false);

	const invalidResponsive: Responsive = getConfigClone().responsive;
	invalidResponsive.tablet.breakpoint = 200;
	expect(hasOverlappingBreakpoints(invalidResponsive)).toBe(true);
});

test('hasValidBreakpoints', () => {
	const defaultResponsive: Responsive = getConfigClone().responsive;
	expect(hasValidBreakpoints(defaultResponsive)).toBe(true);

	const invalidResponsive: Responsive = getConfigClone().responsive;
	invalidResponsive.mobile.breakpoint = 400.5;
	expect(() => hasValidBreakpoints(invalidResponsive)).toThrow('Breakpoints must be positive integers');

	invalidResponsive.mobile.breakpoint = defaultResponsive.mobile.breakpoint;
	invalidResponsive.tablet.breakpoint = 200;
	expect(() => hasValidBreakpoints(invalidResponsive)).toThrow("Breakpoints can't overlap");
});

test('clean', () => {
	const longString = `
							hello world
	`;

	expect(clean(longString)).toBe('hello world');
	expect(clean('')).toBe('');
});

describe('CSS browser-vendors', () => {
	test('Correctly added to the rule sets', () => {
		const unprefixed = `
			opacity: 0;
			transform: translateX(-20px);
		`;
		const prefixed = `
			-webkit-opacity: 0;
			-ms-opacity: 0;
			opacity: 0;
			-webkit-transform: translateX(-20px);
			-ms-transform: translateX(-20px);
			transform: translateX(-20px);
		`;
		const sanitizedStyles = sanitizeStyles(prefixed).trim();
		expect(addVendors(unprefixed)).toBe(sanitizedStyles);
	});
});

describe('Media queries are added correctly', () => {
	const responsive: Responsive = getConfigClone().responsive;
	const { mobile, tablet, laptop } = responsive;

	responsive.desktop.enabled = false;

	const styles = `
		opacity: 0;
		transform: translateY(-20px);
	`;

	const decorated = `
		@media ${mobile.query}, ${tablet.query}, ${laptop.query} {
			${styles}
		}
	`;

	expect(addMediaQueries(styles, responsive)).toBe(clean(decorated));
});

describe('CSS rules', () => {
	describe('Have the correct properties', () => {
		let options: IOptions = {};
		describe('fly', () => {
			test('With default values', () => {
				options = {};
				const styles = `
					opacity: 0;
					transform: translateY(${init.y}px);
				`;
				expect(getCssRules('fly', options)).toBe(addMediaQueries(addVendors(styles)));
			});

			test('With custom values', () => {
				options = {
					y: -50
				};
				const styles = `
					opacity: 0;
					transform: translateY(${options.y}px);
				`;
				expect(getCssRules('fly', options)).toBe(addMediaQueries(addVendors(styles)));
			});
		});

		test('fade', () => {
			const styles = `
				opacity: 0;
			`;
			expect(getCssRules('fade', options)).toBe(addMediaQueries(addVendors(styles)));
		});

		test('blur', () => {
			const styles = `
				opacity: 0;
				filter: blur(16px);
			`;
			expect(getCssRules('blur', options)).toBe(addMediaQueries(addVendors(styles)));
		});

		test('scale', () => {
			const styles = `
				opacity: 0;
				transform: scale(0);
			`;
			expect(getCssRules('scale', options)).toBe(addMediaQueries(addVendors(styles)));
		});

		describe('slide', () => {
			test('With default values', () => {
				options = {};
				const styles = `
					opacity: 0;
					transform: translateX(${init.x}px);			
				`;
				expect(getCssRules('slide', options)).toBe(addMediaQueries(addVendors(styles)));
			});

			test('With custom values', () => {
				options = {
					x: -50
				};
				const styles = `
					opacity: 0;
					transform: translateX(${options.x}px);			
				`;
				expect(getCssRules('slide', options)).toBe(addMediaQueries(addVendors(styles)));
			});
		});

		describe('spin', () => {
			test('With default styles', () => {
				const styles = `
					opacity: 0;
					transform: rotate(-360deg);
				`;
				expect(getCssRules('spin', options)).toBe(addMediaQueries(addVendors(styles)));
			});

			test('With custom styles', () => {
				options = { rotate: -180 };
				const styles = `
					opacity: 0;
					transform: rotate(${options.rotate}deg);
				`;
				expect(getCssRules('spin', options)).toBe(addMediaQueries(addVendors(styles)));
			});
		});
	});

	test(`Catch errors`, () => {
		const options: IOptions = {};

		expect(() => getCssRules('randomCssClass' as Transitions, options)).toThrow('Invalid CSS class name');
	});
});

describe('Easing functions', () => {
	describe('Have correct weights', () => {
		test('linear', () => {
			expect(getEasing('linear')).toBe('cubic-bezier(0, 0, 1, 1)');
		});

		test('easeInSine', () => {
			expect(getEasing('easeInSine')).toBe('cubic-bezier(0.12, 0, 0.39, 0)');
		});

		test('easeOutSine', () => {
			expect(getEasing('easeOutSine')).toBe('cubic-bezier(0.61, 1, 0.88, 1)');
		});

		test('easeInOutSine', () => {
			expect(getEasing('easeInOutSine')).toBe('cubic-bezier(0.37, 0, 0.63, 1)');
		});

		test('easeInQuad', () => {
			expect(getEasing('easeInQuad')).toBe('cubic-bezier(0.11, 0, 0.5, 0)');
		});

		test('easeOutQuad', () => {
			expect(getEasing('easeOutQuad')).toBe('cubic-bezier(0.5, 1, 0.89, 1)');
		});

		test('easeInOutQuad', () => {
			expect(getEasing('easeInOutQuad')).toBe('cubic-bezier(0.45, 0, 0.55, 1)');
		});

		test('easeInCubic', () => {
			expect(getEasing('easeInCubic')).toBe('cubic-bezier(0.32, 0, 0.67, 0)');
		});

		test('easeOutCubic', () => {
			expect(getEasing('easeOutCubic')).toBe('cubic-bezier(0.33, 1, 0.68, 1)');
		});

		test('easeInOutCubic', () => {
			expect(getEasing('easeInOutCubic')).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
		});

		test('easeInQuart', () => {
			expect(getEasing('easeInQuart')).toBe('cubic-bezier(0.5, 0, 0.75, 0)');
		});

		test('easeOutQuart', () => {
			expect(getEasing('easeOutQuart')).toBe('cubic-bezier(0.25, 1, 0.5, 1)');
		});

		test('easeInOutQuart', () => {
			expect(getEasing('easeInOutQuart')).toBe('cubic-bezier(0.76, 0, 0.24, 1)');
		});

		test('easeInQuint', () => {
			expect(getEasing('easeInQuint')).toBe('cubic-bezier(0.64, 0, 0.78, 0)');
		});

		test('easeOutQuint', () => {
			expect(getEasing('easeOutQuint')).toBe('cubic-bezier(0.22, 1, 0.36, 1)');
		});

		test('easeInOutQuint', () => {
			expect(getEasing('easeInOutQuint')).toBe('cubic-bezier(0.83, 0, 0.17, 1)');
		});

		test('easeInExpo', () => {
			expect(getEasing('easeInExpo')).toBe('cubic-bezier(0.7, 0, 0.84, 0)');
		});

		test('easeOutExpo', () => {
			expect(getEasing('easeOutExpo')).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
		});

		test('easeInOutExpo', () => {
			expect(getEasing('easeInOutExpo')).toBe('cubic-bezier(0.87, 0, 0.13, 1)');
		});

		test('easeInCirc', () => {
			expect(getEasing('easeInCirc')).toBe('cubic-bezier(0.55, 0, 1, 0.45)');
		});

		test('easeOutCirc', () => {
			expect(getEasing('easeOutCirc')).toBe('cubic-bezier(0, 0.55, 0.45, 1)');
		});

		test('easeInOutCirc', () => {
			expect(getEasing('easeInOutCirc')).toBe('cubic-bezier(0.85, 0, 0.15, 1)');
		});

		test('easeInBack', () => {
			expect(getEasing('easeInBack')).toBe('cubic-bezier(0.36, 0, 0.66, -0.56)');
		});

		test('easeOutBack', () => {
			expect(getEasing('easeOutBack')).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
		});

		test('easeInOutBack', () => {
			expect(getEasing('easeInOutBack')).toBe('cubic-bezier(0.68, -0.6, 0.32, 1.6)');
		});

		test('custom', () => {
			const customEasing: CustomEasing = [0.2, 0.8, 1, 0.2];
			expect(getEasing('custom', customEasing)).toBe(`cubic-bezier(${customEasing.join(', ')})`);
		});
	});

	describe('Catch invalid values', () => {
		test('Throws error', () => {
			expect(() => getEasing('custom')).toThrow('Invalid easing function');
		});
	});
});
