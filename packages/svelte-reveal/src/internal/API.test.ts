import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDefaultOptions } from '@/API.ts';
import { defaultOptions } from '@/default/options.ts';

describe('setDefaultOptions', () => {
  let snapshot: typeof defaultOptions;

  beforeEach(() => {
    snapshot = { ...defaultOptions };
  });

  afterEach(() => {
    Object.assign(defaultOptions, snapshot);
  });

  it('persists user overrides into the global defaultOptions', () => {
    setDefaultOptions({ duration: 2000, delay: 250 });

    expect(defaultOptions.duration).toBe(2000);
    expect(defaultOptions.delay).toBe(250);
  });

  it('returns the updated defaults', () => {
    const updated = setDefaultOptions({ duration: 2000 });

    expect(updated.duration).toBe(2000);
  });

  it('returns a clone so callers cannot mutate the global defaults', () => {
    const updated = setDefaultOptions({ duration: 2000 });
    updated.duration = 9999;

    expect(defaultOptions.duration).toBe(2000);
  });
});
