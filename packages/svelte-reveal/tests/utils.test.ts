import { defOpts } from '../src/internal/config';
import { setConfig, setObserverConfig } from '../src/internal/API';
import type { RevealOptions } from '../src/internal/types/reveal';
import { clean, createFinalOptions, createObserverConfig } from '../src/internal/utils';

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

test('clean', () => {
  const longString = `
							hello world
	`;

  expect(clean(longString)).toBe('hello world');
  expect(clean('')).toBe('');
});

describe('createFinalOptions', () => {
  test('Using valid options', () => {
    const validOptions: RevealOptions = {
      threshold: 0.6,
      opacity: 0,
      delay: 200,
      duration: 2000,
      blur: 16,
      scale: 0
    };
    const finalOptions = Object.assign({}, defOpts, validOptions);
    expect(createFinalOptions(validOptions)).toStrictEqual(finalOptions);
  });
});

test('createObserverConfig', () => {
  const observerOverrides = {
    threshold: 0.3
  };
  const observerConfig = createObserverConfig(observerOverrides);

  expect(observerConfig.threshold).toBe(observerOverrides.threshold);
  expect(observerConfig.rootMargin).toBe(defOpts.rootMargin);
  expect(observerConfig.root).toBe(defOpts.root);
});
