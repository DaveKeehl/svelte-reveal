enum TransitionType {
  FLY = 'fly',
  FADE = 'fade',
  BLUR = 'blur',
  SCALE = 'scale',
  SLIDE = 'slide',
  SPIN = 'spin'
}

/**
 * The types of supported transitions.
 */
export type Transition = keyof typeof TransitionType;

type BaseRevealTransition = {
  /**
   * When set to false, the transition for the target element is disabled.
   */
  disable?: boolean;
  /**
   * When set to true, the node transitions out when out of view, and is revealed again when back in view.
   *
   * ⚠️ Be careful not to overuse this option.
   */
  reset?: boolean;
  /**
   * How long the transition lasts (in milliseconds).
   */
  duration?: number;
  /**
   * How long the transition is delayed (in milliseconds) before being triggered.
   */
  delay?: number;
  /**
   * The starting opacity value in percentage of any transition.
   * It can be a number between `0.0` and `1.0`.
   */
  opacity?: number;
};

type SlideRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: TransitionType.SLIDE;
  /**
   * The starting offset position in pixels on the x-axis of the `"slide"` transition.
   * If `x` is negative, the element will transition from the left, else from the right.
   */
  x?: number;
};

type FlyRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: TransitionType.FLY;
  /**
   * The starting offset position in pixels on the y-axis of the `"fly"` transition.
   * If `y` is negative, the element will transition from the top, else from the bottom.
   */
  y?: number;
};

type SpinRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: TransitionType.SPIN;
  /**
   * The starting rotation offset in degrees of the `"spin"` transition.
   * If `rotate` is positive, the element will spin clockwise, else counter-clockwise.
   */
  rotate?: number;
};

type BlurRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: TransitionType.BLUR;
  /**
   * The starting blur value in pixels of the `"blur"` transition.
   */
  blur?: number;
};

type ScaleRevealTransition = BaseRevealTransition & {
  /**
   * The type of transition that is triggered when the target node becomes visible.
   */
  transition: TransitionType.SCALE;
  /**
   * The starting scale value in percentage of the `"scale"` transition.
   */
  scale?: number;
};

export type RevealTransition =
  | SlideRevealTransition
  | FlyRevealTransition
  | SpinRevealTransition
  | BlurRevealTransition
  | ScaleRevealTransition;
