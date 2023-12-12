import { describe, expect, it, beforeAll, vi } from "vitest";
import buildWrapComponent from "./buildWrapComponent";
import React from "react";
import Mn from "backbone.marionette";
import { template } from "lodash";
import extendMarionetteViews from "./extendMarionetteViews";

describe("extendMarionetteViews", () => {
  beforeAll(() => {
    extendMarionetteViews();
  });

  it("should replace the template region when using showReactView", async () => {
    const MyComponent = () => <p>My Component</p>;

    const wrapComponent = buildWrapComponent();

    const MyComponentView = wrapComponent(MyComponent);

    const root = document.createElement("div");
    root.id = "root";

    document.appendChild(root);

    const TestView = Mn.View.extend({
      el: "#root",
      template: template('<div class="region"/>'),
      regions: {
        region: ".region",
      },
    });

    const layout = new TestView();
    const exampleView = new MyComponentView();

    layout.render();
    layout.showReactView("region", exampleView);

    exampleView.render();
    // TODO: Figure out why this isn't getting called automatically.
    exampleView.triggerMethod("dom:refresh");

    await vi.waitFor(() => expect(layout.$el.html()).toContain("My Component"));

    await vi.waitFor(() =>
      expect(layout.$el[0]).toMatchInlineSnapshot(
        `
        <div
          id="root"
        >
          <div
            class="reactView"
          >
            <p>
              My Component
            </p>
          </div>
        </div>
      `
      )
    );
  });
});
