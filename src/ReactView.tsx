/**
 * Based on stutrek/redux-marionette
 * https://gist.github.com/stutrek/650be2f8b40a51318a16a6ad9c716eef
 */
import Mn from "backbone.marionette";
import { createRoot } from "react-dom/client";

const ReactView: typeof Mn.View = Mn.View.extend({
  className() {
    const classNames = this.options?.classNames?.join(" ");

    return classNames ? `reactView ${classNames}` : "reactView";
  },

  template() {
    return "";
  },

  onDestroy: function () {
    if (this.root) {
      this.root.unmount();
    }
  },

  onBeforeRender: function () {
    if (this.root) {
      this.root.unmount();
    }

    this.root = createRoot(this.$el[0]);
  },

  renderValidation: function () {
    if (typeof this.renderComponent !== "function") {
      throw new TypeError(
        "To use React in Marionette you must add a renderComponent method to your view."
      );
    }
  },

  /**
   * why onDomRefresh instead of attach or render?
   *
   * From the Marionette docs
   * > If you are re-rendering your view after it has been shown,
   * > you most likely want to listen to the dom:refresh event.
   *
   * `dom:refresh` is triggered by the `attach` method and on subsequent re-renders
   */
  onDomRefresh: function () {
    this.renderValidation();

    this.root.render(this.renderComponent());
  },
});

export default ReactView;
