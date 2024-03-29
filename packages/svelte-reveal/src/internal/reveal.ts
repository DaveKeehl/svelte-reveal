import { config } from '@/default/config.ts';
import { defaultOptions } from '@/default/options.ts';
import { mergeOptions } from '@/utils.ts';
import { isStyleTagCreatedStore, hasPageReloadedStore } from '@/stores.ts';
import { getNodeToReveal, revealNode, createIntersectionObserver } from '@/DOM.ts';
import { getRevealClassNames, createStylesheet } from '@/styling/generation.ts';
import type { ActionReturn } from '@/types/events.ts';
import type { RevealOptions } from '@/types/options.ts';

/**
 * Reveals a given HTML node element on scroll.
 * @param node The DOM node element to apply the reveal on scroll effect to.
 * @param userOptions User-provided options to tweak the scroll animation behavior for `node`.
 * @returns The action object containing the update and destroy functions for `node`.
 */
export const reveal = (
  node: HTMLElement,
  userOptions: Partial<RevealOptions> = defaultOptions
): Partial<ActionReturn> => {
  const options = mergeOptions(userOptions);
  const { transition, disable, onRevealStart, onMount, onUpdate, onDestroy } = options;

  const nodeToReveal = getNodeToReveal(node);
  const [transitionDeclaration, transitionProperties] = getRevealClassNames(transition);

  onMount(nodeToReveal);

  let hasPageReloaded = false;
  const unsubscribePageReloaded = hasPageReloadedStore.subscribe((val: boolean) => (hasPageReloaded = val));

  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === 'reload') hasPageReloadedStore.set(true);
  if (disable || (config.once && hasPageReloaded)) return {};

  let isStyleTagCreated = false;
  const unsubscribeStyleTagCreated = isStyleTagCreatedStore.subscribe((val: boolean) => (isStyleTagCreated = val));

  if (!isStyleTagCreated) {
    createStylesheet();
    isStyleTagCreatedStore.set(true);
  }

  onRevealStart(nodeToReveal);
  revealNode(nodeToReveal, transitionDeclaration, transitionProperties, options);

  const observer = createIntersectionObserver(nodeToReveal, options, transitionDeclaration);
  observer.observe(nodeToReveal);

  return {
    update() {
      onUpdate(nodeToReveal);
    },
    destroy() {
      onDestroy(nodeToReveal);
      unsubscribeStyleTagCreated();
      unsubscribePageReloaded();
      observer.disconnect();
    }
  };
};
