import { markRevealNode } from '../DOM';
import { extractCSSRules, sanitizeStyles } from './stylesExtraction';

/**
 * Creates the CSS stylesheet where all the reveal styles are added to.
 */
export const createStylesheet = (): void => {
	const style = document.createElement('style');
	style.setAttribute('type', 'text/css');

	markRevealNode(style);

	const head = document.querySelector('head');
	if (head !== null) head.appendChild(style);
};

/**
 * Decorate CSS rules with vendor prefixes.
 * @param unprefixedStyles The unprefixed styles.
 * @returns The prefixed CSS styles.
 */
export const addVendorPrefixes = (unprefixedStyles: string): string => {
	const rules = extractCSSRules(unprefixedStyles);

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
