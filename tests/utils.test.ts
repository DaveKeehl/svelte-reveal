import type { CustomEasing } from '../src/types';
import { getEasing } from '../src/utils';

const customEasing: CustomEasing = [0.2, 0.8, 1, 0.2];

test('Cubic-bezier easing function requires array of values', () => {
	expect(getEasing('linear', customEasing)).toBe('linear');
});
