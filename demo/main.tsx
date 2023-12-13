console.log("Hello");

import extendMarionetteViews from "../src/extendMarionetteViews";
import buildWrapComponent from "../src/buildWrapComponent";

import Mn from "backbone.marionette";
import React, { useContext, useState } from "react";
import z from "zod";

const wrapComponent = buildWrapComponent();
extendMarionetteViews();

let theme = "";

const ReactButtonView = wrapComponent(() => {
  const [counter, setCounter] = useState(0);
  return (
    <button type="button" onClick={() => setCounter((state) => state + 1)}>
      I'm a react button {counter}
    </button>
  );
});

const ViewWithSchema = wrapComponent((props: any) => <div>{props.name}</div>, {
  schema: z.object({ name: z.string() }),
});

type Skin = "red" | "blue";
const ThemeContext = React.createContext<{
  theme: { skin: Skin };
  setSkin: React.Dispatch<React.SetStateAction<Skin>>;
}>({ theme: { skin: "red" }, setSkin: (skin) => {} });

const ThemeProvider = ({
  children,
  override,
}: {
  children: React.ReactNode;
  override?: Skin;
}) => {
  const [skin, setSkin] = useState<Skin>(override ?? "red");

  return (
    <ThemeContext.Provider value={{ theme: { skin }, setSkin }}>
      {children}
    </ThemeContext.Provider>
  );
};

const wrapComponentWithProviders = buildWrapComponent<{ override?: Skin }>(
  ({ children, override }) => (
    <ThemeProvider override={override}>{children}</ThemeProvider>
  )
);

const PropsSchemaForProviders = z.object({ onClick: z.function() });
const ViewWithProviders = wrapComponentWithProviders(
  (props: unknown) => {
    const { onClick } = PropsSchemaForProviders.parse(props);
    const { theme, setSkin } = useContext(ThemeContext);

    return (
      <div
        style={{
          background: theme.skin === "red" ? "red" : "blue",
          padding: "1rem",
          color: "white",
        }}
      >
        Click to change background{" "}
        <button
          type="button"
          onClick={() => {
            onClick();
            setSkin((state) => (state === "red" ? "blue" : "red"));
          }}
        >
          Hi.
        </button>
      </div>
    );
  },
  { schema: PropsSchemaForProviders }
);

const LayoutView = Mn.View.extend({
  el: "#root",
  template: () =>
    `
    <section>
        <h1>Marionette View</h1>
        <h2>Standard Usage</h2>
        <div class="js-standard"/>
        <h2>Custom Providers + onClick prop (logs to console)</h2>
        <div class="js-providers"/>
        <h2>Invalid Props + Schema (console error)</h2>
        <div class="js-schema"/>
    </section>
    `,
  regions: {
    standard: ".js-standard",
    providers: ".js-providers",
    schema: ".js-schema",
  },
  onRender() {
    const reactView = new ReactButtonView();

    this.showReactView("standard", reactView);

    this.showReactView(
      "providers",
      new ViewWithProviders({
        override: "blue",
        props: { onClick: () => console.log("clicked") },
      })
    );

    try {
      this.showReactView(
        "schema",
        new ViewWithSchema({ props: { names: ["test"] } })
      );
    } catch {
      const FallbackView = Mn.View.extend({
        template: () => `<div>Failed</div>`,
      });
      this.showChildView("schema", new FallbackView());
    }
  },
});

const layout = new LayoutView();

layout.render();
