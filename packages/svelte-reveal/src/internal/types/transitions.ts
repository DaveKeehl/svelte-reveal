export type BaseRevealTransition = {
  /**
   * When set to false, the transition is disabled for the target element.
   */
  disable: boolean;
  /**
   * When set to true, the node transitions out when out of view, and is revealed again when back in view.
   *
   * ⚠️ Be careful not to overuse this option.
   */
  reset: boolean;
  /**
   * How long the transition lasts (in ms).
   */
  duration: number;
  /**
   * How long the transition is delayed (in ms) before being triggered.
   */
  delay: number;
  /**
   * The starting opacity value in percentage of any transition. It can be a number between `0.0` and `1.0`.
   */
  opacity: number;
};

export type FadeRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'fade';
};

export type SlideRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'slide';
  /**
   * The starting offset position in pixels on the x-axis of the `"slide"` transition.
   * If `x` is negative, the element will transition from the left, else from the right.
   */
  x: number;
};

export type FlyRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'fly';
  /**
   * The starting offset position in pixels on the y-axis of the `"fly"` transition.
   * If `y` is negative, the element will transition from the top, else from the bottom.
   */
  y: number;
};

export type SpinRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'spin';
  /**
   * The starting rotation offset in degrees of the `"spin"` transition.
   * If `rotate` is positive, the element will spin clockwise, else counter-clockwise.
   */
  rotate: number;
};

export type BlurRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'blur';
  /**
   * The starting blur value in pixels of the `"blur"` transition.
   */
  blur: number;
};

export type ScaleRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: 'scale';
  /**
   * The starting scale value in percentage of the `"scale"` transition.
   */
  scale: number;
};

export type RevealTransition =
  | FadeRevealTransition
  | SlideRevealTransition
  | FlyRevealTransition
  | SpinRevealTransition
  | BlurRevealTransition
  | ScaleRevealTransition;

/**
 * The type of transition to use.
 */
export type Transition = RevealTransition['transition'];
