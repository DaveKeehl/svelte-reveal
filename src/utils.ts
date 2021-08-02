import type { Transitions, IOptions, Easing, CustomEase } from './types';

const addVendors = (unprefixedStyles: string): string => {
	const rules = unprefixedStyles
		.trim()
		.replace(/(\n|\t)/g, '')
		.split(';')
		.slice(0, -1);
	let prefixedStyles = '';

	rules.forEach((rule) => {
		const [property, value] = rule.trim().split(': ');
		const decorated = `
            -webkit-${property}: ${value};
            -ms-${property}: ${value}; 
            ${property}: ${value};`;
		prefixedStyles += decorated;
	});

	return prefixedStyles;
};

export const getCssProperties = (transition: Transitions, init: IOptions, options: IOptions): string => {
	const { x = init.x, y = init.y } = options;

	let styles = '';

	if (transition === 'fly') {
		styles = `
			opacity: 0;
			transform: translateY(${y}px);
		`;
	} else if (transition === 'fade') {
		styles = `
			opacity: 0;
		`;
	} else if (transition === 'blur') {
		styles = `
			opacity: 0;
			filter: blur(16px);
		`;
	} else if (transition === 'scale') {
		styles = `
			opacity: 0;
			transform: scale(0);
		`;
	} else if (transition === 'slide') {
		styles = `
			opacity: 0;
			transform: translateX(${x}px);
		`;
	}

	return addVendors(styles);
};

export const getEasing = (easing: Easing, customEase: CustomEase): string => {
	let easingText: string = easing;

	if (easing === 'cubic-bezier') {
		easingText = `cubic-bezier(${customEase.join(', ')})`;
	}

	return easingText;
};
