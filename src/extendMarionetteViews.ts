import Mn from "backbone.marionette";

import ReactView from "./ReactView";

/**
 * Used to replace the region element with a react view directly instead of rendering
 * an intermediary and unecessary div.
 *
 * ```
 * <div class="el">
 *   <div class="template-region">
 *     <p>react content</p>
 *   </div>
 * </div>
 * ```
 *
 * becomes
 *
 * ```
 * <div class="el">
 *     <p class="template">react content</p>
 * </div>
 * ```
 *
 * You need to run this function before rendering any views. Ideally in your entrypoint.
 *
 * @example
 * import {extendMarionetteViews} from 'marionette-react-migration';
 *
 * extendMarionetteViews() // <- Applies the prototype method for use in views
 *
 * const MyView = Mn.View.extend({
 *   // ...
 *   onRender() {
 *     this.showReactView('region', new ReactView())
 *   }
 * })
 */
export default () => {
  /**
   * @example
   * onRender() {
   * this.showReactView('regionName', new ReactView())
   * }
   */
  // @ts-expect-error: Adding to the prototype.
  Mn.View.prototype.showReactView = function (
    regionName: string,
    view: typeof ReactView
  ) {
    if (!(view instanceof ReactView))
      throw new Error("Use showReactView() only with ReactViews");

    const region = this.getRegion(regionName);

    // @ts-expect-error: replaceElement is not in the @types lib
    region.show(view, { replaceElement: true });
  };
};
