import { clean } from '../utils';

/**
 * Extract the CSS rules of a given style
 * @param styles - The styles to extract the rules from
 * @returns An array of CSS properties
 */
export const extractCssRules = (styles: string): string[] => {
	return clean(styles)
		.split(';')
		.filter((rule) => rule !== '')
		.map((rule) => rule.trim());
};

/**
 * Clean and minify your CSS styles
 * @param styles - The styles to be sanitized
 * @returns The minified and sanitized styles
 */
export const sanitizeStyles = (styles: string): string => {
	return extractCssRules(styles).join('; ').concat('; ');
};
