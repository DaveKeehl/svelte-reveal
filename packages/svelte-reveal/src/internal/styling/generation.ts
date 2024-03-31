import seedrandom from 'seedrandom';

import { markRevealNode } from '@/DOM.ts';
import { standardEasingWeights } from '@/default/easing.ts';
import { addMediaQueries } from '@/styling/media-queries.ts';
import type { Transition } from '@/types/transitions.ts';
import type { Easing, EasingWeights } from '@/types/easing.ts';
import type { RevealOptions } from '@/types/options.ts';

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

const createRevealClassName = (type: 'transition' | 'properties', transition: Transition, uid: string) => {
  const tokens = [type, transition].map((token) => token.replace(/\s/g, '-')).join('__');
  return `sr__${tokens}__${uid}`;
};

/**
 * Creates the CSS classes needed to add the transitions to the target element.
 * @param ref A reference name that will be prefixed in the class name.
 * @param transition The transition name to be prefixed in the class name.
 * @returns A tuple with the final CSS classes in the form of: [transitionDeclaration, transitionProperties]. The transition declaration class is used to declare a transition css rule to the target element. The transition properties class is used to create the actual transition.
 */
export const getRevealClassNames = (transition: Transition): [string, string] => {
  const seed = document.querySelectorAll('[data-action="reveal"]').length.toString();
  const uid = seedrandom(seed)().toString().slice(2);

  const transitionDeclaration = createRevealClassName('transition', transition, uid);
  const transitionProperties = createRevealClassName('properties', transition, uid);

  return [transitionDeclaration, transitionProperties];
};

/**
 * Get the transition properties CSS rules of a given transition.
 * @param transition The name of the transition.
 * @param options The options used by the transition.
 * @returns The CSS rules to be used to create the given transition.
 */
export const createTransitionPropertyRules = (options: Required<RevealOptions>): string => {
  const { opacity } = options;

  switch (options.transition) {
    case 'fade':
      return `
				opacity: ${opacity};
			`;
    case 'slide':
      return `
				opacity: ${opacity};
				transform: translateX(${options.x}px);
			`;
    case 'fly':
      return `
				opacity: ${opacity};
				transform: translateY(${options.y}px);
			`;
    case 'spin':
      return `
				opacity: ${opacity};
				transform: rotate(${options.rotate}deg);
			`;
    case 'blur':
      return `
				opacity: ${opacity};
				filter: blur(${options.blur}px);
			`;
    case 'scale':
      return `
				opacity: ${opacity};
				transform: scale(${options.scale});
			`;
  }
};

/**
 * Generates the CSS rule for the transition declaration of the target element.
 * @param className - The transition declaration CSS class of the target element.
 * @param options - The options to be used when creating the CSS for the transition declaration.
 * @returns The transition declaration CSS for the target element.
 */
export const createCssTransitionDeclaration = ({
  className,
  duration,
  delay,
  easing
}: {
  className: string;
  duration: Required<RevealOptions>['duration'];
  delay: Required<RevealOptions>['delay'];
  easing: Easing;
}) => {
  return `
		.${className} {
			transition: all ${duration / 1000}s ${delay / 1000}s ${getCssEasingFunction(easing)};
		}
	`;
};

/**
 * Generates the CSS rules for the start of the transition of the target element.
 * @param className - The transition properties CSS class of the target element.
 * @param options - The options to be used when creating the CSS for the transition properties.
 * @returns The transition properties CSS for the target element.
 */
export const createCssTransitionProperties = ({
  className,
  options
}: {
  className: string;
  options: Required<RevealOptions>;
}) => {
  const transitionPropertiesRules = createTransitionPropertyRules(options);

  return `
		.${className} {
			${transitionPropertiesRules}
		}
	`;
};

/**
 * Merges any existing reveal styles with the new ones for the current DOM node that is being "activated". This process is necessary because one CSS stylesheet is shared among all the elements in the page.
 * @param prevRevealStyles Any existing reveal styles in the Svelte Reveal stylesheet.
 * @param newRevealStyles The CSS of the DOM node to be revealed.
 * @returns The merged CSS reveal styles to be used to update the Svelte Reveal stylesheet.
 */
export const mergeRevealStyles = (prevRevealStyles: string, newRevealStyles: string): string => {
  return [prevRevealStyles, addMediaQueries(newRevealStyles).trim()].join(' ');
};

/**
 * Creates a valid CSS easing function.
 * @param easing The easing function to be applied.
 * @param customEasing Optional tuple to create a custom cubic-bezier easing function.
 * @returns A valid CSS easing function.
 */
export const getCssEasingFunction = (easing: Easing): string => {
  const createEasingFunction = (weights: EasingWeights) => `cubic-bezier(${weights.join(', ')})`;

  if (typeof easing !== 'string') return createEasingFunction(easing);
  return createEasingFunction(standardEasingWeights[easing]);
};
