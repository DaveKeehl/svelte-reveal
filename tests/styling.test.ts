import { init, config } from '../src/internal/config';
import { setConfig } from '../src/internal/API';
import {
	createStylesheet,
	hasOverlappingBreakpoints,
	hasValidBreakpoints,
	sanitizeStyles,
	addVendors,
	addMediaQueries,
	getCssRules,
	getEasing,
	getMinifiedStylesFromQuery,
	createMainCss,
	createTransitionCss,
	getUpdatedStyles,
	createClassNames
} from '../src/internal/styling';
import type { Responsive, IOptions, Transitions, CustomEasing } from '../src/internal/types';
import { clean } from '../src/internal/utils';

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

describe('getStylesFromQueries', () => {
	test('Just minifies when no media query is used', () => {
		const tree = `
			parent: {
				children: {
					children: {
						res: "bingo"
					}
				}
			}
		`;
		expect(getMinifiedStylesFromQuery(tree)).toStrictEqual('parent: {children: {children: {res: "bingo"}}}');
	});

	test('Correctly extracts inner styles', () => {
		const tree = `
			@media (min-width: 320px) and (max-width: 1080px) {
				parent: {
					children: {
						children: {
							res: "bingo"
						}
					}
				}
			}
		`;
		expect(getMinifiedStylesFromQuery(tree)).toStrictEqual('parent: {children: {children: {res: "bingo"}}}');
	});
});

describe('getUpdatedStyles', () => {
	const oldStyles = `
		.class1 {
			opacity: 0;
		}
		.class2 {
			opacity: 1;
		}
	`;
	const mainCssClass = createClassNames('', false, 'fly');
	const baseCssClass = createClassNames('', true, 'fly');
	const mainCss = createMainCss(mainCssClass, init);
	const transitionCss = createTransitionCss(baseCssClass, init);
	const updatedStyles = getUpdatedStyles(oldStyles, mainCss, transitionCss);

	test('Has no media queries by default', () => {
		expect((updatedStyles.match(/@media/g) || []).length).toBe(0);
	});

	test('Has only one media query when responsiveness is applied', () => {
		// TODO
	});
});

describe('createStylesheet', () => {
	document.body.innerHTML = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
				<title>HTML 5 Boilerplate</title>
				<link rel="stylesheet" href="style.css">
			</head>
			<body>
			<script src="index.js"></script>
			</body>
		</html>
	`;

	createStylesheet();

	test('Library stylesheet is correctly added to the page', () => {
		const stylesheets = document.querySelectorAll('style[data-action="reveal"]');
		expect(stylesheets.length).toEqual(1);
	});
});

describe('hasOverlappingBreakpoints', () => {
	test('Returns false with default values', () => {
		expect(hasOverlappingBreakpoints(config.responsive)).toBe(false);
	});

	test('Returns true when breakpoints overlap', () => {
		config.responsive.tablet.breakpoint = 200;
		expect(hasOverlappingBreakpoints(config.responsive)).toBe(true);
	});
});

describe('hasValidBreakpoints', () => {
	test('Returns true with default values', () => {
		expect(hasValidBreakpoints(config.responsive)).toBe(true);
	});

	test('Should throw an error when using floating point numbers', () => {
		config.responsive.mobile.breakpoint = 400.5;
		expect(() => hasValidBreakpoints(config.responsive)).toThrow('Breakpoints must be positive integers');
	});

	test('Should throw an error when breakpoints overlap', () => {
		config.responsive.tablet.breakpoint = 200;
		expect(() => hasValidBreakpoints(config.responsive)).toThrow("Breakpoints can't overlap");
	});
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

describe('Media queries behave correctly', () => {
	const styles = '.class { opacity: 0; transform: translateY(-20px); }';

	test('No media queries when all devices are enabled', () => {
		expect(addMediaQueries(styles)).toBe(styles);
	});

	test('Disable library CSS styles when no devices are enabled', () => {
		const custom: Responsive = {
			mobile: {
				enabled: false,
				breakpoint: 425
			},
			tablet: {
				enabled: false,
				breakpoint: 768
			},
			laptop: {
				enabled: false,
				breakpoint: 1440
			},
			desktop: {
				enabled: false,
				breakpoint: 2560
			}
		};

		const decorated = `
			@media not all {
				${styles}
			}
		`;

		expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
	});

	describe('Combine queries', () => {
		test('With only consecutive devices starting from the smallest one', () => {
			const custom: Responsive = {
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
					enabled: false,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (max-width: 1440px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With only consecutive devices starting from the largest one', () => {
			const custom: Responsive = {
				mobile: {
					enabled: false,
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
			};

			const decorated = `
				@media (min-width: 426px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With multiple single spaced devices (1)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: true,
					breakpoint: 425
				},
				tablet: {
					enabled: false,
					breakpoint: 768
				},
				laptop: {
					enabled: true,
					breakpoint: 1440
				},
				desktop: {
					enabled: false,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (max-width: 425px), (min-width: 769px) and (max-width: 1440px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With multiple single spaced devices (2)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: false,
					breakpoint: 425
				},
				tablet: {
					enabled: true,
					breakpoint: 768
				},
				laptop: {
					enabled: false,
					breakpoint: 1440
				},
				desktop: {
					enabled: true,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (min-width: 426px) and (max-width: 768px), (min-width: 1441px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With pairs of consecutive enabled devices (1)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: true,
					breakpoint: 425
				},
				tablet: {
					enabled: true,
					breakpoint: 768
				},
				laptop: {
					enabled: false,
					breakpoint: 1440
				},
				desktop: {
					enabled: false,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (max-width: 768px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With pairs of consecutive enabled devices (2)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: false,
					breakpoint: 425
				},
				tablet: {
					enabled: false,
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
			};

			const decorated = `
				@media (min-width: 769px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With pairs of consecutive enabled devices (3)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: false,
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
					enabled: false,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (min-width: 426px) and (max-width: 1440px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With pairs and single enabled devices (1)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: true,
					breakpoint: 425
				},
				tablet: {
					enabled: true,
					breakpoint: 768
				},
				laptop: {
					enabled: false,
					breakpoint: 1440
				},
				desktop: {
					enabled: true,
					breakpoint: 2560
				}
			};

			const decorated = `
				@media (max-width: 768px), (min-width: 1441px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});

		test('With pairs and single enabled devices (2)', () => {
			const custom: Responsive = {
				mobile: {
					enabled: true,
					breakpoint: 425
				},
				tablet: {
					enabled: false,
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
			};

			const decorated = `
				@media (max-width: 425px), (min-width: 769px) {
					${styles}
				}
			`;

			expect(addMediaQueries(styles, custom)).toBe(clean(decorated));
		});
	});
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
