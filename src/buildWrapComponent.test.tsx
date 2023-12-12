import { describe, expect, it, beforeEach, vi } from "vitest";
import buildWrapComponent from "./buildWrapComponent";
import React from "react";
import Mn from "backbone.marionette";
import _ from "lodash";
import Backbone from "backbone";

describe("buildWrapComponent", () => {
  beforeEach(() => {
    window.Backbone = Backbone;
  });

  it("should return a function", () => {
    expect(typeof buildWrapComponent()).toBe("function");
  });

  it("should return a function that returns a Marionette.View", () => {
    const MyComponent = () => <div>My Component</div>;

    const wrapComponent = buildWrapComponent(MyComponent);

    const MyComponentView = wrapComponent(MyComponent);

    expect(typeof MyComponentView).toBe("function");
    expect(MyComponentView.prototype).toBeInstanceOf(Mn.View);
  });

  it("should render the react component onDomRefresh", async () => {
    const MyComponent = () => <div>My Component</div>;

    const wrapComponent = buildWrapComponent();

    const MyComponentView = wrapComponent(MyComponent);

    const exampleView = new MyComponentView();

    exampleView.render();
    // TODO: Figure out why this isn't getting called automatically.
    exampleView.triggerMethod("dom:refresh");

    await vi.waitFor(() =>
      expect(exampleView.$el.html()).toBe("<div>My Component</div>")
    );
  });

  it("should unmount the react component onDestroy", async () => {
    const MyComponent = () => <div>My Component</div>;

    const wrapComponent = buildWrapComponent();

    const MyComponentView = wrapComponent(MyComponent);

    const view = new MyComponentView();

    view.render();
    view.triggerMethod("dom:refresh");

    await vi.waitFor(() =>
      expect(view.$el.html()).toBe("<div>My Component</div>")
    );

    view.destroy();

    expect(view.$el.html()).toBe("");
  });
});
