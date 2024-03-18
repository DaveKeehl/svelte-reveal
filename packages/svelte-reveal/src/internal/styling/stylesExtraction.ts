import { cleanString } from '../utils';

/**
 * Cleans and minifies CSS styles.
 * @param styles The CSS styles to be sanitized.
 * @returns The sanitized CSS styles.
 */
export const sanitizeStyles = (styles: string): string => {
  const cssRules = cleanString(styles).split(';');
  const sanitizedCssRules = cssRules.filter((rule) => rule !== '').map((rule) => rule.trim());
  return sanitizedCssRules.join('; ').concat('; ');
};
