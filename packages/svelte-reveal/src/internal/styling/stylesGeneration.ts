import { markRevealNode } from '../DOM';

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
