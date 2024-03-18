/**
 * Object containing the Intersection Observer options.
 */
export type IntersectionObserverConfig = {
  /**
   * The root element used by the Intersection Observer.
   */
  root: IntersectionObserver['root'];
  /**
   * The root margin property of the Intersection Observer.
   */
  rootMargin: IntersectionObserver['rootMargin'];
  /**
   * The threshold (in percentage from 0.0 to 1.0) property used by the Intersection
   * Observer to know when its target element is considered visible.
   */
  threshold: number;
};
