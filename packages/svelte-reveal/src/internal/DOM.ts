import {
  createCssTransitionProperties,
  createCssTransitionDeclaration,
  mergeRevealStyles
} from './styling/generation.ts';
import type { RevealOptions } from './types/options.ts';
import { cleanString, createObserverConfig } from './utils.ts';

/**
 * Marks a DOM node as part of the reveal process.
 * @param revealNode The element to be marked.
 * @returns The marked DOM element.
 */
export const markRevealNode = (revealNode: HTMLElement): HTMLElement => {
  revealNode.setAttribute('data-action', 'reveal');
  return revealNode;
};

/**
 * Activates the reveal effect on the target element.
 * @param nodeToReveal The element to be revealed.
 * @param transitionPropertiesClassName The CSS class to be used to create the transition properties on the target element.
 * @param transitionDeclarationClassName The CSS class to be used to declare the transition on the target element.
 * @param options The options to be applied to the reveal effect.
 * @returns The element to be revealed.
 */
export const activateRevealNode = (
  nodeToReveal: HTMLElement,
  transitionPropertiesClassName: string,
  transitionDeclarationClassName: string,
  options: RevealOptions
): HTMLElement => {
  markRevealNode(nodeToReveal);

  const cssTransitionProperties = createCssTransitionProperties({ className: transitionPropertiesClassName, options });
  const cssTransitionDeclaration = createCssTransitionDeclaration({
    className: transitionDeclarationClassName,
    duration: options.duration,
    delay: options.delay,
    easing: options.easing
  });
  const stylesheet = document.querySelector('style[data-action="reveal"]');

  /**
   * Since I want to have only one Svelte Reveal stylesheet for all the elements in the page,
   * I need to check whether a Svelte Reveal stylesheet has already been created when previous
   * elements have been "activated" by this library. Hence, the stylesheet content is the
   * concatenation of the styles of all elements on which Svelte Reveal has been activated on the page.
   */
  if (stylesheet) {
    const nodeToRevealStyles = cleanString([cssTransitionProperties, cssTransitionDeclaration].join(' '));
    const updatedRevealStyles = mergeRevealStyles(stylesheet.innerHTML, nodeToRevealStyles);

    stylesheet.innerHTML = updatedRevealStyles;
    nodeToReveal.classList.add(transitionPropertiesClassName, transitionDeclarationClassName);
  }

  return nodeToReveal;
};

/**
 * Get the HTML element to be revealed.
 * @param node The HTML element passed by the svelte action.
 * @returns The HTML element to be revealed.
 */
export const getNodeToReveal = (node: HTMLElement): HTMLElement => {
  if (node.style.length === 0) return node;
  const wrapper = document.createElement('div');
  wrapper.appendChild(node);
  return wrapper;
};

/**
 * Creates an Intersection Observer for the reveal node.
 * @param canDebug Toggles logging for the Intersection Observer notifications.
 * @param highlightText The color hex code to be used to color the logs.
 * @param revealNode The HTML node to observe.
 * @param options The reveal options.
 * @param className The CSS class to add/remove from/to the target element.
 * @returns The created Intersection Observer.
 */
export const createObserver = (
  revealNode: HTMLElement,
  options: Required<RevealOptions>,
  className: string
): IntersectionObserver => {
  const { reset, duration, delay, threshold, onResetStart, onResetEnd, onRevealEnd } = options;

  const observerConfig = createObserverConfig();
  const sleep = duration + delay;

  return new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry) => {
      if (reset && !entry.isIntersecting) {
        onResetStart(revealNode);
        revealNode.classList.add(className);
        setTimeout(() => onResetEnd(revealNode), sleep);
      } else if (entry.intersectionRatio >= threshold) {
        setTimeout(() => onRevealEnd(revealNode), sleep);
        revealNode.classList.remove(className);
        if (!reset) observer.unobserve(revealNode);
      }
    });
  }, observerConfig);
};
