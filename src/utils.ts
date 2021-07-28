import type { Transitions, IOptions } from './index.d';

export const printRef = (ref: string): void => {
	console.log(`--- ${ref} ---`);
};

export const getCssProperties = (transition: Transitions, init: IOptions, options: IOptions): string => {
	const { x = init.x, y = init.y } = options;

	if (transition === 'fly') {
		return `
			opacity: 0;
			transform: translateY(${y}px);
		`;
	}
	if (transition === 'fade') {
		return `
			opacity: 0;
		`;
	}
	if (transition === 'blur') {
		return `
			opacity: 0;
			filter: blur(16px);
		`;
	}
	if (transition === 'scale') {
		return `
			opacity: 0;
			transform: scale(0);
		`;
	}
	if (transition === 'slide') {
		return `
			opacity: 0;
			transform: translateX(${x}px);
		`;
	}
};
