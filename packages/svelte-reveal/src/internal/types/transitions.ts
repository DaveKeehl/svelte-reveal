export type RevealTransition = {
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
   * The starting opacity value. It can be a number between `0.0` and `1.0`.
   */
  opacity: number;
  /**
   * The transition preset that should be applied.
   */
  preset: 'fade' | 'slide' | 'fly' | 'spin' | 'blur' | 'scale';
  /**
   * The starting offset position in pixels on the x-axis.
   */
  x: number;
  /**
   * The starting offset position in pixels on the y-axis.
   */
  y: number;
  /**
   * The starting rotation offset in degrees.
   */
  rotate: number;
  /**
   * The starting blur value in pixels.
   */
  blur: number;
  /**
   * The starting scale value in percentage.
   */
  scale: number;
};
