export type RevealDebugOptions = {
  /**
   * It enables/disables debugging mode for the target DOM element.
   * This will log to the console the target DOM element, along with the options and config.
   *
   * In order to be able to use this mode, you are required to also set the `ref` property.
   */
  debug?: boolean;
  /**
   * When `debug` is set to `true`, you are required to specificy a `ref` string.
   *
   * When multiple DOM nodes have debug mode enabled, `ref` strings allow you to
   * know to which DOM node a console log statement belongs to.
   */
  ref?: string;
  /**
   * When set to true, the console logs of the target node are colored,
   * making it easier to see them among many other logs.
   */
  highlightLogs?: boolean;
  /**
   * The color to use to color the console logs when the `highlightLogs` option is also set to true.
   *
   * Any valid CSS color can be used here.
   */
  highlightColor?: string;
};
