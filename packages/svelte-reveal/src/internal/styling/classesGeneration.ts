import seedrandom from 'seedrandom';
import {
  getTransitionPropertiesCSSRules as getTransitionPropertiesCssRules,
  getCssEasingFunction
} from './stylesRetrieval';
import type { Transition } from '../types/transitions';
import type { Easing } from '../types/easing';
import type { RevealOptions } from '../types/options';

const createClassNameTokens = (tokensArray: string[]) =>
  tokensArray
    .filter((token) => token && token !== '')
    .map((token) => token.replace(/\s/g, '-'))
    .join('__');

const createClassName = (tokens: string, uid: string) => `sr__${tokens}__${uid}`;

/**
 * Creates the CSS classes needed to add the transitions to the target element.
 * @param ref A reference name that will be prefixed in the class name.
 * @param transition The transition name to be prefixed in the class name.
 * @returns A tuple with the final CSS classes in the form of: [transitionDeclaration, transitionProperties]. The transition declaration class is used to declare a transition css rule to the target element. The transition properties class is used to create the actual transition.
 */
export const getRevealClassNames = (ref: string, transition: Transition): [string, string] => {
  const tokens = {
    transition: [ref, 'transition', transition],
    properties: [ref, 'properties', transition]
  };

  const transitionClassTokens = createClassNameTokens(tokens.transition);
  const propertiesClassTokens = createClassNameTokens(tokens.properties);

  const seed = document.querySelectorAll('[data-action="reveal"]').length.toString();
  const uid = seedrandom(seed)().toString().slice(2);

  const transitionDeclaration = createClassName(transitionClassTokens, uid);
  const transitionProperties = createClassName(propertiesClassTokens, uid);

  return [transitionDeclaration, transitionProperties];
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
  duration: NonNullable<RevealOptions['duration']>;
  delay: NonNullable<RevealOptions['delay']>;
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
  const transitionPropertiesRules = getTransitionPropertiesCssRules(options);

  return `
		.${className} {
			${transitionPropertiesRules}
		}
	`;
};
