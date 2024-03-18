import { defOpts } from '../default/config';
import { standardEasingWeights } from '../default/easing';
import type { Easing, EasingWeights } from '../types/easing';
import type { RevealOptions } from '../types/options';
import type { Transition } from '../types/transitions';
import { addMediaQueries } from './mediaQueries';

/**
 * Merges any existing reveal styles with the new ones for the current DOM node that is being "activated". This process is necessary because one CSS stylesheet is shared among all the elements in the page.
 * @param existingRevealStyles Any existing reveal styles in the Svelte Reveal stylesheet.
 * @param nodeRevealStyles The CSS of the DOM node to be revealed.
 * @returns The merged CSS reveal styles to be used to update the Svelte Reveal stylesheet.
 */
export const mergeRevealStyles = (existingRevealStyles: string, nodeRevealStyles: string): string => {
  const combinedRevealStyles = [existingRevealStyles, nodeRevealStyles].join(' ');
  return addMediaQueries(combinedRevealStyles).trim();
};

/**
 * Get the transition properties CSS rules of a given transition.
 * @param transition The name of the transition.
 * @param options The options used by the transition.
 * @returns The CSS rules to be used to create the given transition.
 */
export const getTransitionPropertiesCSSRules = (options: RevealOptions): string => {
  const { transition } = options;
  const { x, y, rotate, opacity, blur, scale } = { ...defOpts, options };

  const transitions: Record<Transition, string> = {
    fly: `
			opacity: ${opacity};
			transform: translateY(${y}px);
		`,
    fade: `
			opacity: ${opacity};
		`,
    blur: `
			opacity: ${opacity};
			filter: blur(${blur}px);
		`,
    scale: `
			opacity: ${opacity};
			transform: scale(${scale});
		`,
    slide: `
			opacity: ${opacity};
			transform: translateX(${x}px);
		`,
    spin: `
			opacity: ${opacity};
			transform: rotate(${rotate}deg);
		`
  };

  return transitions[transition];
};

/**
 * Creates a valid CSS easing function.
 * @param easing The easing function to be applied.
 * @param customEasing Optional tuple to create a custom cubic-bezier easing function.
 * @returns A valid CSS easing function.
 */
export const getCssEasingFunction = (easing: Easing): string => {
  const createEasingFunction = (weights: EasingWeights) => `cubic-bezier(${weights.join(', ')})`;

  if (easing.type === 'custom') return createEasingFunction(easing.weights);
  return createEasingFunction(standardEasingWeights[easing.type]);
};
