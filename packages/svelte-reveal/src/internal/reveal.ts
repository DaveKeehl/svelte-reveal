import { getRevealClassNames, createStylesheet } from './styling/generation.ts';
import { config } from './default/config.ts';
import { isStyleTagCreated, hasPageReloaded } from './stores.ts';
import { getNodeToReveal, activateRevealNode, createObserver } from './DOM.ts';
import { createFinalOptions } from './utils.ts';
import type { ActionReturn } from './types/events.ts';
import type { RevealOptions } from './types/options.ts';
import { defaultOptions } from './default/options.ts';

/**
 * Reveals a given HTML node element on scroll.
 * @param node The DOM node element to apply the reveal on scroll effect to.
 * @param options User-provided options to tweak the scroll animation behavior for `node`.
 * @returns The action object containing the update and destroy functions for `node`.
 */
export const reveal = (node: HTMLElement, options: Partial<RevealOptions> = defaultOptions): Partial<ActionReturn> => {
  const finalOptions = createFinalOptions(options);
  const { transition, disable, onRevealStart, onMount, onUpdate, onDestroy } = finalOptions;

  const nodeToReveal = getNodeToReveal(node);
  const [transitionDeclaration, transitionProperties] = getRevealClassNames(transition);

  onMount(nodeToReveal);

  // Checking if page was reloaded
  let reloaded = false;
  const unsubscribeReloaded = hasPageReloaded.subscribe((value: boolean) => (reloaded = value));
  const navigation = window.performance.getEntriesByType('navigation');

  let navigationType: string | number = '';
  if (navigation.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignoreq
    navigationType = navigation[0].type;
  } else {
    // Using deprecated navigation object as a last resort to detect a page reload
    navigationType = window.performance.navigation.type; // NOSONAR
  }
  if (navigationType === 'reload' || navigationType === 1) hasPageReloaded.set(true);
  if (disable || (config.once && reloaded)) return {};

  // Setting up the styles
  let styleTagExists = false;
  const unsubscribeStyleTag = isStyleTagCreated.subscribe((value: boolean) => (styleTagExists = value));

  if (!styleTagExists) {
    createStylesheet();
    isStyleTagCreated.set(true);
  }

  onRevealStart(nodeToReveal);
  activateRevealNode(nodeToReveal, transitionDeclaration, transitionProperties, finalOptions);

  const observerInstance = createObserver(nodeToReveal, finalOptions, transitionDeclaration);
  observerInstance.observe(nodeToReveal);

  console.groupEnd();

  return {
    update() {
      onUpdate(nodeToReveal);
    },
    destroy() {
      onDestroy(nodeToReveal);
      unsubscribeStyleTag();
      unsubscribeReloaded();
      observerInstance.disconnect();
    }
  };
};
