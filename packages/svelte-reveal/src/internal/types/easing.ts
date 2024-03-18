export type StandardEasingFunction =
  | 'linear'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack';

export type EasingWeights = [number, number, number, number];

type StandardEasing = {
  /**
   * The types of supported easing functions that can be used to tweak the timing of a transition.
   */
  type: StandardEasingFunction;
};

type CustomEasing = {
  /**
   * The types of supported easing functions that can be used to tweak the timing of a transition.
   */
  type: 'custom';
  /**
   * The individual weights of a custom cubic-bezier curve.
   */
  weights: EasingWeights;
};

export type Easing = StandardEasing | CustomEasing;
