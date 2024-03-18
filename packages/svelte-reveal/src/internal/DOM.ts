import { config } from './default/config';
import { createCssTransitionProperties, createCssTransitionDeclaration, mergeRevealStyles } from './styling';
import type { RevealOptions } from './types/options';
import { cleanString, createObserverConfig } from './utils';

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
 * @param revealNode The element to be revealed.
 * @param transitionPropertiesCSSClass The CSS class to be used to create the transition properties on the target element.
 * @param transitionDeclarationCSSClass The CSS class to be used to declare the transition on the target element.
 * @param options The options to be applied to the reveal effect.
 * @returns The element to be revealed.
 */
export const activateRevealNode = (
  revealNode: HTMLElement,
  transitionPropertiesCSSClass: string,
  transitionDeclarationCSSClass: string,
  options: Required<RevealOptions>
): HTMLElement => {
  markRevealNode(revealNode);

  const transitionDeclaration = createCssTransitionDeclaration({
    className: transitionDeclarationCSSClass,
    duration: options.duration,
    delay: options.delay,
    easing: options.easing
  });
  const transitionProperties = createCssTransitionProperties({ className: transitionPropertiesCSSClass, options });
  const stylesheet = document.querySelector('style[data-action="reveal"]');

  /**
   * Since I want to have only one Svelte Reveal stylesheet for all the elements in the page,
   * I need to check whether a Svelte Reveal stylesheet has already been created when previous
   * elements have been "activated" by this library. Hence, the stylesheet content is the
   * concatenation of the styles of all elements on which Svelte Reveal has been activated on the page.
   */
  if (stylesheet) {
    const nodeRevealStyles = cleanString([transitionProperties, transitionDeclaration].join(' '));
    const updatedRevealStyles = mergeRevealStyles(stylesheet.innerHTML, nodeRevealStyles);

    stylesheet.innerHTML = updatedRevealStyles;
    revealNode.classList.add(transitionPropertiesCSSClass);
    revealNode.classList.add(transitionDeclarationCSSClass);
  }

  return revealNode;
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
  canDebug: boolean,
  highlightText: string,
  revealNode: HTMLElement,
  options: Required<RevealOptions>,
  className: string
): IntersectionObserver => {
  const { ref, reset, duration, delay, threshold, onResetStart, onResetEnd, onRevealEnd } = options;

  const observerConfig = createObserverConfig();

  return new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (canDebug) {
      const entry = entries[0];

      if (!entry) {
        throw new Error('Intersection Observer entry is undefined');
      }

      const entryTarget = entry.target;

      if (entryTarget === revealNode) {
        console.groupCollapsed(`%cRef: ${ref} (Intersection Observer Callback)`, highlightText);
        console.log(entry);
        console.log(observerConfig);
        console.groupEnd();
      }
    }

    entries.forEach((entry) => {
      if (reset && !entry.isIntersecting) {
        onResetStart(revealNode);
        revealNode.classList.add(className);
        setTimeout(() => onResetEnd(revealNode), duration + delay);
      } else if (entry.intersectionRatio >= threshold) {
        setTimeout(() => onRevealEnd(revealNode), duration + delay);
        revealNode.classList.remove(className);
        if (!reset) observer.unobserve(revealNode);
      }
    });
  }, observerConfig);
};

/**
 * Logs data about the reveal node, the default options and the global configuration.
 * @param finalOptions The library options merged with the ones provided by the user.
 * @param revealNode The DOM element to be revealed.
 * @returns A tuple consisting of canDebug and highlightText.
 */
export const logInfo = (finalOptions: Required<RevealOptions>, revealNode: HTMLElement): [boolean, string] => {
  const { debug, ref, highlightLogs, highlightColor } = finalOptions;

  const canDebug = config.dev && debug && ref !== '';
  const highlightText = `color: ${highlightLogs ? highlightColor : '#B4BEC8'}`;

  if (canDebug) {
    console.groupCollapsed(`%cRef: ${ref}`, highlightText);

    console.groupCollapsed('%cNode', highlightText);
    console.log(revealNode);
    console.groupEnd();

    console.groupCollapsed('%cConfig', highlightText);
    console.log(config);
    console.groupEnd();

    console.groupCollapsed('%cOptions', highlightText);
    console.log(finalOptions);
    console.groupEnd();
  }

  return [canDebug, highlightText];
};
