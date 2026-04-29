import { test, expect } from '@playwright/test';

test.describe('wrapperClass option', () => {
  test('without wrapperClass, the injected wrapper breaks the parent flex layout', async ({ page }) => {
    await page.goto('/?test=wrapper');

    const parent = page.getByTestId('parent-bare');
    const child = page.getByTestId('bare-child');

    await expect(child).toBeVisible();

    const parentBox = await parent.boundingBox();
    const childBox = await child.boundingBox();

    expect(parentBox).not.toBeNull();
    expect(childBox).not.toBeNull();

    // The injected wrapper is a default-display <div>, so the user's `flex: 1`
    // can't reach the flex parent and the child collapses to its intrinsic width.
    expect(parentBox!.width).toBeGreaterThanOrEqual(390);
    expect(childBox!.width).toBeLessThan(parentBox!.width / 4);
  });

  test('with wrapperClass, the wrapper carries the flex contract and the child fills the parent', async ({ page }) => {
    await page.goto('/?test=wrapper');

    const parent = page.getByTestId('parent-fixed');
    const child = page.getByTestId('fixed-child');

    await expect(child).toBeVisible();

    const parentBox = await parent.boundingBox();
    const childBox = await child.boundingBox();

    expect(parentBox).not.toBeNull();
    expect(childBox).not.toBeNull();

    expect(childBox!.width).toBeCloseTo(parentBox!.width, 0);
    expect(childBox!.height).toBeCloseTo(parentBox!.height, 0);
  });

  test('wrapperClass is applied as a class on the injected wrapper element', async ({ page }) => {
    await page.goto('/?test=wrapper');

    const child = page.getByTestId('fixed-child');
    await expect(child).toBeVisible();

    const wrapperHasClass = await child.evaluate((el) => el.parentElement?.classList.contains('fill'));
    expect(wrapperHasClass).toBe(true);
  });
});
