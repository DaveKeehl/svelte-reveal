import { clean } from '../utils';

/**
 * Extracts the CSS rules of a given style.
 * @param styles The styles to extract the rules from.
 * @returns An array of CSS properties.
 */
export const extractCSSRules = (styles: string): string[] => {
	return clean(styles)
		.split(';')
		.filter((rule) => rule !== '')
		.map((rule) => rule.trim());
};

/**
 * Cleans and minifies CSS styles.
 * @param styles The CSS styles to be sanitized.
 * @returns The sanitized CSS styles.
 */
export const sanitizeStyles = (styles: string): string => {
	return extractCSSRules(styles).join('; ').concat('; ');
};
