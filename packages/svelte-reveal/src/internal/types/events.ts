/**
 * The events fired by the Svelte action.
 */
export type RevealEvents = {
  /**
   * Function that gets fired when the node starts being revealed.
   */
  onRevealStart: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the node is fully revealed.
   */
  onRevealEnd: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the `reset` option is set to `true` and the node starts transitioning out.
   */
  onResetStart: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the `reset` option is set to `true` and the node has fully transitioned out.
   */
  onResetEnd: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the node is mounted on the DOM.
   */
  onMount: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the action options are updated.
   */
  onUpdate: (node: HTMLElement) => void;
  /**
   * Function that gets fired when the node is unmounted from the DOM.
   */
  onDestroy: (node: HTMLElement) => void;
};

/**
 * The return type of the Svelte action.
 */
export type ActionReturn = {
  /**
   * Lifecycle function that is triggered when the action options are updated.
   */
  update: () => void;
  /**
   * Lifecycle function that is triggered when the node is unmounted from the DOM.
   */
  destroy: () => void;
};
