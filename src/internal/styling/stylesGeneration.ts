import { markRevealNode } from '../DOM';
import { extractCssRules, sanitizeStyles } from './stylesExtraction';

/**
 * Creates the stylesheet for the reveal animation styles.
 */
export const createStylesheet = (): void => {
	const style = document.createElement('style');
	style.setAttribute('type', 'text/css');

	markRevealNode(style);

	const head = document.querySelector('head');
	if (head !== null) head.appendChild(style);
};

/**
 * Decorate a set of CSS rules with browser-vendors prefixes.
 * @param unprefixedStyles - The unprefixed styles
 * @returns The prefixed CSS styles
 */
export const addVendors = (unprefixedStyles: string): string => {
	const rules = extractCssRules(unprefixedStyles);

	const prefixedStyles = rules.reduce((styles, rule) => {
		const [property, value] = rule
			.trim()
			.split(':')
			.map((r) => r.trim());

		const newStyles = sanitizeStyles(`
			-webkit-${property}: ${value};
			-ms-${property}: ${value};
			${property}: ${value};
		`);

		return styles.concat(newStyles);
	}, '');

	return prefixedStyles.trim();
};
