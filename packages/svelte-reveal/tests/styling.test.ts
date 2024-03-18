import { defOpts, config } from '../src/internal/default/config';
import { setConfig, setObserverConfig } from '../src/internal/API';
import {
  createStylesheet,
  hasOverlappingBreakpoints,
  hasValidBreakpoints,
  sanitizeStyles,
  addVendorPrefixes,
  addMediaQueries,
  getTransitionPropertiesCssRules,
  getCssEasingFunction,
  getMinifiedStylesFromQuery,
  createCssTransitionProperties,
  createCssTransitionDeclaration,
  mergeRevealStyles,
  getRevealClassNames
} from '../src/internal/styling';
import type { Responsive, RevealOptions, Transition, CustomEasing } from '../src/internal/types/config';
import { cleanString } from '../src/internal/utils';

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
    }
  });
  setObserverConfig({
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0.6
  });
});

describe('getMinifiedStylesFromQuery', () => {
  test('Throw an error when using invalid media queries', () => {
    const invalidQuery = `
			@media (min-width: 320px) and (max-width: 1080px) {`;
    expect(() => getMinifiedStylesFromQuery(invalidQuery)).toThrow('Invalid media query');
  });

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

describe('mergeRevealStyles', () => {
  const existingStyles = `
		.class1 {
			opacity: 0;
		}
		.class2 {
			opacity: 1;
		}
	`;
  const [transitionDeclarationClass, transitionPropertiesClass] = getRevealClassNames('', 'fly');
  const transitionProperties = createCssTransitionProperties(transitionDeclarationClass, defOpts);
  const transitionDeclaration = createCssTransitionDeclaration(transitionPropertiesClass, defOpts);
  const nodeRevealStyles = cleanString([transitionProperties, transitionDeclaration].join(' '));
  const updatedStyles = mergeRevealStyles(existingStyles, nodeRevealStyles);

  test('Has no media queries by default', () => {
    expect((updatedStyles.match(/@media/g) || []).length).toBe(0);
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
    expect(hasValidBreakpoints(config.responsive)).toBe(false);
  });

  test('Should throw an error when breakpoints overlap', () => {
    config.responsive.tablet.breakpoint = 200;
    expect(hasValidBreakpoints(config.responsive)).toBe(false);
  });
});

describe('addVendorPrefixes', () => {
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
    expect(addVendorPrefixes(unprefixed)).toBe(sanitizedStyles);
  });
});

describe('addMediaQueries', () => {
  const styles = '.class { opacity: 0; transform: translateY(-20px); }';

  test('No media queries when all devices are enabled', () => {
    expect(addMediaQueries(styles)).toBe(styles);
  });

  test('Throw an error when adding media queries with invalid breakpoints', () => {
    const invalidResponsive: Responsive = {
      mobile: {
        enabled: false,
        breakpoint: 425
      },
      tablet: {
        enabled: false,
        breakpoint: 400
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
    expect(() => addMediaQueries(styles, invalidResponsive)).toThrow(
      'Cannot create media queries due to invalid breakpoints'
    );
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

    expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
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

      expect(addMediaQueries(styles, custom)).toBe(cleanString(decorated));
    });
  });
});

describe('getTransitionPropertiesCSSRules', () => {
  describe('Have the correct properties', () => {
    let options: RevealOptions = {};
    describe('fly', () => {
      test('With default values', () => {
        options = {};
        const styles = `
					opacity: 0;
					transform: translateY(${defOpts.y}px);
				`;
        expect(getTransitionPropertiesCssRules('fly', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });

      test('With custom values', () => {
        options = {
          y: -50
        };
        const styles = `
					opacity: 0;
					transform: translateY(${options.y}px);
				`;
        expect(getTransitionPropertiesCssRules('fly', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });
    });

    test('fade', () => {
      const styles = `
				opacity: 0;
			`;
      expect(getTransitionPropertiesCssRules('fade', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
    });

    test('blur', () => {
      const styles = `
				opacity: 0;
				filter: blur(16px);
			`;
      expect(getTransitionPropertiesCssRules('blur', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
    });

    test('scale', () => {
      const styles = `
				opacity: 0;
				transform: scale(0);
			`;
      expect(getTransitionPropertiesCssRules('scale', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
    });

    describe('slide', () => {
      test('With default values', () => {
        options = {};
        const styles = `
					opacity: 0;
					transform: translateX(${defOpts.x}px);			
				`;
        expect(getTransitionPropertiesCssRules('slide', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });

      test('With custom values', () => {
        options = {
          x: -50
        };
        const styles = `
					opacity: 0;
					transform: translateX(${options.x}px);			
				`;
        expect(getTransitionPropertiesCssRules('slide', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });
    });

    describe('spin', () => {
      test('With default styles', () => {
        const styles = `
					opacity: 0;
					transform: rotate(-360deg);
				`;
        expect(getTransitionPropertiesCssRules('spin', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });

      test('With custom styles', () => {
        options = { rotate: -180 };
        const styles = `
					opacity: 0;
					transform: rotate(${options.rotate}deg);
				`;
        expect(getTransitionPropertiesCssRules('spin', options)).toBe(addMediaQueries(addVendorPrefixes(styles)));
      });
    });
  });

  test(`Catch errors`, () => {
    const options: RevealOptions = {};

    expect(() => getTransitionPropertiesCssRules('randomCssClass' as Transition, options)).toThrow(
      'Invalid CSS class name'
    );
  });
});

describe('getEasingFunction', () => {
  describe('Have correct weights', () => {
    test('linear', () => {
      expect(getCssEasingFunction('linear')).toBe('cubic-bezier(0, 0, 1, 1)');
    });

    test('easeInSine', () => {
      expect(getCssEasingFunction('easeInSine')).toBe('cubic-bezier(0.12, 0, 0.39, 0)');
    });

    test('easeOutSine', () => {
      expect(getCssEasingFunction('easeOutSine')).toBe('cubic-bezier(0.61, 1, 0.88, 1)');
    });

    test('easeInOutSine', () => {
      expect(getCssEasingFunction('easeInOutSine')).toBe('cubic-bezier(0.37, 0, 0.63, 1)');
    });

    test('easeInQuad', () => {
      expect(getCssEasingFunction('easeInQuad')).toBe('cubic-bezier(0.11, 0, 0.5, 0)');
    });

    test('easeOutQuad', () => {
      expect(getCssEasingFunction('easeOutQuad')).toBe('cubic-bezier(0.5, 1, 0.89, 1)');
    });

    test('easeInOutQuad', () => {
      expect(getCssEasingFunction('easeInOutQuad')).toBe('cubic-bezier(0.45, 0, 0.55, 1)');
    });

    test('easeInCubic', () => {
      expect(getCssEasingFunction('easeInCubic')).toBe('cubic-bezier(0.32, 0, 0.67, 0)');
    });

    test('easeOutCubic', () => {
      expect(getCssEasingFunction('easeOutCubic')).toBe('cubic-bezier(0.33, 1, 0.68, 1)');
    });

    test('easeInOutCubic', () => {
      expect(getCssEasingFunction('easeInOutCubic')).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
    });

    test('easeInQuart', () => {
      expect(getCssEasingFunction('easeInQuart')).toBe('cubic-bezier(0.5, 0, 0.75, 0)');
    });

    test('easeOutQuart', () => {
      expect(getCssEasingFunction('easeOutQuart')).toBe('cubic-bezier(0.25, 1, 0.5, 1)');
    });

    test('easeInOutQuart', () => {
      expect(getCssEasingFunction('easeInOutQuart')).toBe('cubic-bezier(0.76, 0, 0.24, 1)');
    });

    test('easeInQuint', () => {
      expect(getCssEasingFunction('easeInQuint')).toBe('cubic-bezier(0.64, 0, 0.78, 0)');
    });

    test('easeOutQuint', () => {
      expect(getCssEasingFunction('easeOutQuint')).toBe('cubic-bezier(0.22, 1, 0.36, 1)');
    });

    test('easeInOutQuint', () => {
      expect(getCssEasingFunction('easeInOutQuint')).toBe('cubic-bezier(0.83, 0, 0.17, 1)');
    });

    test('easeInExpo', () => {
      expect(getCssEasingFunction('easeInExpo')).toBe('cubic-bezier(0.7, 0, 0.84, 0)');
    });

    test('easeOutExpo', () => {
      expect(getCssEasingFunction('easeOutExpo')).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    });

    test('easeInOutExpo', () => {
      expect(getCssEasingFunction('easeInOutExpo')).toBe('cubic-bezier(0.87, 0, 0.13, 1)');
    });

    test('easeInCirc', () => {
      expect(getCssEasingFunction('easeInCirc')).toBe('cubic-bezier(0.55, 0, 1, 0.45)');
    });

    test('easeOutCirc', () => {
      expect(getCssEasingFunction('easeOutCirc')).toBe('cubic-bezier(0, 0.55, 0.45, 1)');
    });

    test('easeInOutCirc', () => {
      expect(getCssEasingFunction('easeInOutCirc')).toBe('cubic-bezier(0.85, 0, 0.15, 1)');
    });

    test('easeInBack', () => {
      expect(getCssEasingFunction('easeInBack')).toBe('cubic-bezier(0.36, 0, 0.66, -0.56)');
    });

    test('easeOutBack', () => {
      expect(getCssEasingFunction('easeOutBack')).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
    });

    test('easeInOutBack', () => {
      expect(getCssEasingFunction('easeInOutBack')).toBe('cubic-bezier(0.68, -0.6, 0.32, 1.6)');
    });

    test('custom', () => {
      const customEasing: CustomEasing = [0.2, 0.8, 1, 0.2];
      expect(getCssEasingFunction('custom', customEasing)).toBe(`cubic-bezier(${customEasing.join(', ')})`);
    });
  });

  describe('Catch invalid values', () => {
    test('Throws error', () => {
      expect(() => getCssEasingFunction('custom')).toThrow('Invalid easing function');
    });
  });
});
