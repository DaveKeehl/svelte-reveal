import { init } from '../src/internal/config';

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
