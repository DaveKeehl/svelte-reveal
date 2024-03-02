import { config, defOpts } from '../src/internal/config';
import {
  setDev,
  setOnce,
  setDeviceStatus,
  setDevicesStatus,
  setDeviceBreakpoint,
  setDevice,
  setResponsive,
  setObserverConfig,
  setObserverRoot,
  setObserverRootMargin,
  setObserverThreshold,
  setConfig,
  setDefaultOptions
} from '../src/internal/API';
import type { RevealConfig, RevealOptions } from '../src/internal/types/reveal';
import { clone, createObserverConfig, getConfigClone } from '../src/internal/utils';

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

describe('setDevicesStatus', () => {
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
    expect(() => setDeviceBreakpoint('mobile', -200)).toThrow('Invalid breakpoints');
  });

  test('Should throw an error with floating point breakpoints', () => {
    expect(() => setDeviceBreakpoint('mobile', 400.5)).toThrow('Invalid breakpoints');
  });

  test('Should throw an error when a breakpoint overlaps a smaller device', () => {
    expect(() => setDeviceBreakpoint('tablet', 200)).toThrow('Invalid breakpoints');
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
    expect(() => setDevice('mobile', config.responsive.mobile)).toThrow('Invalid breakpoints');
  });

  test('Should throw an error when using a negative breakpoint', () => {
    config.responsive.mobile.breakpoint = -200;
    expect(() => setDevice('mobile', config.responsive.mobile)).toThrow('Invalid breakpoints');
  });

  test('Should throw an error when breakpoints make devices overlap', () => {
    config.responsive.tablet.breakpoint = 200;
    expect(() => setDevice('tablet', config.responsive.tablet)).toThrow('Invalid breakpoints');
  });
});

describe('setResponsive', () => {
  test('Checking default config', () => {
    const defaultConfig: RevealConfig = getConfigClone();
    expect(setResponsive(defaultConfig.responsive)).toStrictEqual(defaultConfig);
  });

  test('Should throw an error when using a negative breakpoint', () => {
    config.responsive.mobile.breakpoint = -200;
    expect(() => setResponsive(config.responsive)).toThrowError('Invalid breakpoints');
  });

  test('Should throw an error when using a floating point breakpoint', () => {
    config.responsive.mobile.breakpoint = 450.5;
    expect(() => setResponsive(config.responsive)).toThrowError('Invalid breakpoints');
  });

  test('Should throw an error when breakpoints make devices overlap', () => {
    config.responsive.tablet.breakpoint = 200;
    expect(() => setResponsive(config.responsive)).toThrowError('Invalid breakpoints');
  });
});

describe('setObserverConfig', () => {
  test('Checking default config', () => {
    const observerConfig = createObserverConfig();
    expect(setObserverConfig(observerConfig)).toStrictEqual(observerConfig);
  });

  test('Should throw an error when threshold is invalid', () => {
    defOpts.threshold = 1.2;
    const observerConfig = createObserverConfig();
    expect(() => setObserverConfig(observerConfig)).toThrow('Threshold must be between 0.0 and 1.0');
  });
});

describe('setObserverRoot', () => {
  test('Checking default config', () => {
    expect(setObserverRoot(null).root).toBe(null);
  });

  test('Correctly updates root when latter is valid', () => {
    const div = document.createElement('div');
    expect(setObserverRoot(div).root).toBe(div);
  });
});

describe('setObserverRootMargin', () => {
  test('Updates rootMargin when respecting the regex', () => {
    setObserverRootMargin('0px 5px 50px 500%');
    expect(defOpts.rootMargin).toBe('0px 5px 50px 500%');

    setObserverRootMargin('0px 5px 50px');
    expect(defOpts.rootMargin).toBe('0px 5px 50px');

    setObserverRootMargin('0px 5px');
    expect(defOpts.rootMargin).toBe('0px 5px');

    setObserverRootMargin('0px');
    expect(defOpts.rootMargin).toBe('0px');
  });

  test('Should throw an error when rootMargin is invalid', () => {
    expect(() => setObserverRootMargin('0px 0px 0px 0px 0px')).toThrow('Invalid rootMargin syntax');
  });
});

describe('setObserverThreshold', () => {
  test('Updates the threshold when the latter is valid', () => {
    setObserverThreshold(1);
    expect(defOpts.threshold).toBe(1);

    setObserverThreshold(1.0);
    expect(defOpts.threshold).toBeCloseTo(1.0);

    setObserverThreshold(0);
    expect(defOpts.threshold).toBe(0);

    setObserverThreshold(0.0);
    expect(defOpts.threshold).toBeCloseTo(0.0);

    setObserverThreshold(0.5);
    expect(defOpts.threshold).toBeCloseTo(0.5);
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
      expect(() => setConfig(config)).toThrowError('Invalid breakpoints');
    });

    test('Invalid when breakpoints are floating points', () => {
      config.responsive.mobile.breakpoint = 450.5;
      expect(() => setConfig(config)).toThrowError('Invalid breakpoints');
    });

    test('Invalid when breakpoints overlap', () => {
      config.responsive.mobile.breakpoint = 400;
      config.responsive.tablet.breakpoint = 300;
      expect(() => setConfig(config)).toThrowError('Invalid breakpoints');
    });
  });

  describe('rootMargin', () => {
    test('Invalid with unknown units', () => {
      defOpts.rootMargin = '0px 0px 0this 0that';
      const observerConfig = createObserverConfig();
      expect(() => setObserverConfig(observerConfig)).toThrow('Invalid rootMargin syntax');
    });
  });

  describe('threshold', () => {
    test('Invalid with negative numbers', () => {
      defOpts.threshold = -1;
      const observerConfig = createObserverConfig();
      expect(() => setObserverConfig(observerConfig)).toThrow('Threshold must be between 0.0 and 1.0');
    });

    test('Invalid with numbers greater than 1', () => {
      defOpts.threshold = 1.5;
      const observerConfig = createObserverConfig();
      expect(() => setObserverConfig(observerConfig)).toThrow('Threshold must be between 0.0 and 1.0');
    });
  });
});

describe('setDefaultOptions', () => {
  test('Passing default options should return default options', () => {
    const defaultOpts = clone(defOpts);
    const newOptions = clone(setDefaultOptions(defOpts));
    expect(newOptions).toStrictEqual(defaultOpts);
  });

  test('Should throw an error when some options are invalid', () => {
    const invalidOptions: RevealOptions = {
      blur: -20
    };
    expect(() => setDefaultOptions(invalidOptions)).toThrow('Invalid options');
  });

  test('Passing new valid options override the default ones', () => {
    const newOptions: RevealOptions = {
      blur: 20,
      x: 50,
      y: 100
    };
    expect(setDefaultOptions(newOptions).blur).toBe(20);
    expect(setDefaultOptions(newOptions).x).toBe(50);
    expect(setDefaultOptions(newOptions).y).toBe(100);
    expect(setDefaultOptions(newOptions).delay).toBe(0);
  });
});
