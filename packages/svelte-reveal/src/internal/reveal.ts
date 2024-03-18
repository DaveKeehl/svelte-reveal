import { getRevealClassNames, createStylesheet } from './styling';
import { config, defOpts } from './default/config';
import { isStyleTagCreated, hasPageReloaded } from './stores';
import { getNodeToReveal, activateRevealNode, createObserver, logInfo } from './DOM';
import { createFinalOptions } from './utils';
import type { ReturnAction } from './types/events';
import type { RevealOptions } from './types/options';

/**
 * Reveals a given HTML node element on scroll.
 * @param node The DOM node element to apply the reveal on scroll effect to.
 * @param options User-provided options to tweak the scroll animation behavior for `node`.
 * @returns The action object containing the update and destroy functions for `node`.
 */
export const reveal = (node: HTMLElement, options: RevealOptions = defOpts): ReturnAction => {
  const finalOptions = createFinalOptions(options);
  const { transition, disable, ref, onRevealStart, onMount, onUpdate, onDestroy } = finalOptions;

  const nodeToReveal = getNodeToReveal(node);
  const [transitionDeclaration, transitionProperties] = getRevealClassNames(ref, transition);

  onMount(nodeToReveal);

  const [canDebug, highlightText] = logInfo(finalOptions, nodeToReveal);

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

  const observerInstance = createObserver(canDebug, highlightText, nodeToReveal, finalOptions, transitionDeclaration);
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
