import type { CustomEase } from '../src/index.d';
import { getEasing } from '../src/utils';

const customEase: CustomEase = [0.2, 0.8, 1, 0.2];

test('Cubic-bezier easing function requires array of values', () => {
	expect(getEasing('linear', customEase)).toBe('linear');
});
