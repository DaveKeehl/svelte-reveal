/**
 * The name of a built-in easing function.
 */
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

/**
 * Array of four numbers, representing a custom bezier curve.
 */
export type EasingWeights = [number, number, number, number];

/**
 * The easing function to use. It can either be an existing one or an array of four numbers representing a custom bezier curve.
 */
export type Easing = StandardEasingFunction | EasingWeights;
