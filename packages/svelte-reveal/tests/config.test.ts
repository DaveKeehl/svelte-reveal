import { defOpts } from '../src/internal/config';

test('Checking default options', () => {
  expect(defOpts.disable).toBe(false);
  expect(defOpts.debug).toBe(false);
  expect(defOpts.ref).toBe('');
  expect(defOpts.highlightLogs).toBe(false);
  expect(defOpts.highlightColor).toBe('tomato');
  expect(defOpts.root).toBe(null);
  expect(defOpts.rootMargin).toBe('0px 0px 0px 0px');
  expect(defOpts.threshold).toBe(0.6);
  expect(defOpts.transition).toBe('fly');
  expect(defOpts.reset).toBe(false);
  expect(defOpts.delay).toBe(0);
  expect(defOpts.duration).toBe(800);
  expect(defOpts.easing).toBe('custom');
  expect(defOpts.customEasing).toStrictEqual([0.25, 0.1, 0.25, 0.1]);
  expect(defOpts.x).toBe(-20);
  expect(defOpts.y).toBe(-20);
  expect(defOpts.rotate).toBe(-360);
  expect(defOpts.opacity).toBe(0);
  expect(defOpts.blur).toBe(16);
  expect(defOpts.scale).toBe(0);

  const node = document.createElement('p');
  expect(defOpts.onRevealStart(node)).toBe(null);
  expect(defOpts.onRevealEnd(node)).toBe(null);
  expect(defOpts.onResetStart(node)).toBe(null);
  expect(defOpts.onResetEnd(node)).toBe(null);
  expect(defOpts.onMount(node)).toBe(null);
  expect(defOpts.onUpdate(node)).toBe(null);
  expect(defOpts.onDestroy(node)).toBe(null);
});
