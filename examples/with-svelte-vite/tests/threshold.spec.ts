import { test, expect } from '@playwright/test';

test('per-action threshold is forwarded to the IntersectionObserver', async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.IntersectionObserver;
    const observed: Array<IntersectionObserverInit | undefined> = [];
    class SpyObserver extends Original {
      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(cb, options);
        observed.push(options);
      }
    }
    (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      SpyObserver as typeof IntersectionObserver;
    (window as unknown as { __observedIO: typeof observed }).__observedIO = observed;
  });

  await page.goto('/?test=threshold');
  await expect(page.getByTestId('threshold-target')).toBeVisible();

  const observed = await page.evaluate(
    () => (window as unknown as { __observedIO: IntersectionObserverInit[] }).__observedIO
  );

  // The action requested threshold 0.1; the bug was that the IO was always
  // constructed with the default 0.6.
  const match = observed.find((o) => o?.threshold === 0.1);
  expect(match, `expected an IntersectionObserver with threshold 0.1, got ${JSON.stringify(observed)}`).toBeTruthy();
});
