type StandardRevealEasing = {
  /**
   * The types of supported easing functions that can be used to tweak the timing of a transition.
   */
  type:
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
};

type CustomRevealEasing = {
  /**
   * The types of supported easing functions that can be used to tweak the timing of a transition.
   */
  type: 'custom';
  /**
   * The individual weights of a custom cubic-bezier curve.
   */
  weights: [number, number, number, number];
};

export type RevealEasing = StandardRevealEasing | CustomRevealEasing;
