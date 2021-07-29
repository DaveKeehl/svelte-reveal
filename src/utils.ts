import type { Transitions, IOptions, Easing, CustomEase } from './index.d';

export const printRef = (ref: string): void => {
	console.log(`--- ${ref} ---`);
};

export const getCssProperties = (transition: Transitions, init: IOptions, options: IOptions): string => {
	const { x = init.x, y = init.y } = options;
	let style = '';

	if (transition === 'fly') {
		style = `
			opacity: 0;
			transform: translateY(${y}px);
		`;
	} else if (transition === 'fade') {
		style = `
			opacity: 0;
		`;
	} else if (transition === 'blur') {
		style = `
			opacity: 0;
			filter: blur(16px);
		`;
	} else if (transition === 'scale') {
		style = `
			opacity: 0;
			transform: scale(0);
		`;
	} else if (transition === 'slide') {
		style = `
			opacity: 0;
			transform: translateX(${x}px);
		`;
	}

	return style;
};

export const getEasing = (easing: Easing, customEase: CustomEase): string => {
	let easingText: string = easing;

	if (easing === 'cubic-bezier') {
		easingText = `cubic-bezier(${customEase.join(', ')})`;
	}

	return easingText;
};
