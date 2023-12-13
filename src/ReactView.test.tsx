import { describe, it, expect } from "vitest";
import buildWrapComponent from "./buildWrapComponent";
import React from "react";
import ReactView from "./ReactView";

const wrapComponent = buildWrapComponent();

describe("ReactView", () => {
  it("should join classNames", () => {
    const MyComponentView = wrapComponent(() => <div>MyComponent</div>);

    const view = new MyComponentView({ classNames: ["foo", "bar"] });

    view.render();

    expect(view.$el[0].className).toBe("reactView foo bar");
  });
  it("should validate the render method is present", () => {
    const View = new ReactView();

    expect(() => {
      View.render();
      View.triggerMethod("dom:refresh");
    }).toThrowError(
      "To use React in Marionette you must add a renderComponent method to your view."
    );
  });
});
