import React from "react";
import Mn from "backbone.marionette";
import ReactView from "./ReactView";
import { ZodSchema } from "zod";

function isFunction(value: unknown) {
  return typeof value === "function";
}

type ReactViewConstructor<
  T extends Backbone.Model<any, Backbone.ModelSetOptions, any> = Backbone.Model<
    any,
    Backbone.ModelSetOptions,
    any
  >
> = new (
  options?: (Mn.ViewOptions<T> & { classNames: string[] }) | undefined
) => Mn.View<T>;

type Options = {
  /**
   * This is a way to make props typesafe, often you'll be interfacing with JS marionette code
   * If you want to treat js code as unsafe, you can pass in a schema which throws an error if the props are invalid
   * or returns typed props after being parsed.
   * @example Example with zod schema
   * ```ts
   * const propsSchema = z.object({ name: z.string() });
   *
   * const MyComponent = wrapComponent(MyComponent, {
   *  schema: propsSchema,
   * });
   * ```
   *
   * */
  schema?: ZodSchema;
};

const buildExtendedView = ({
  Component,
  options = {},
  Providers,
}: {
  Component: React.FC;
  options: Options;
  Providers?: React.FC<{ children: React.ReactNode }>;
}) =>
  ReactView.extend({
    renderComponent() {
      const props = isFunction(this.options.props)
        ? this.options.props()
        : this.options.props;

      const parsedProps = options.schema ? options.schema.parse(props) : props;

      const component = <Component {...parsedProps} />;

      if (Providers) {
        return <Providers>{component}</Providers>;
      }

      return component;
    },
  }) as ReactViewConstructor;

/**
 * Use this to build your own wrapComponent function with any necessary providers
 *
 * @example
 * ```ts
 * const wrapComponent = buildWrapComponent(MyComponent, {
 *   Providers: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
 * });
 *
 * const MyComponentView = wrapComponent(MyComponent);
 *
 * Marionette.View.extend({
 *  template: `<div class="my-component"></div>`,
 *  regions: {
 *   myComponent: '.my-component',
 *  },
 *  onRender() {
 *   this.showChildView('myComponent', new MyComponentView({ props: { name: 'John' } }));
 *  },
 * });
 * ```
 */
const buildWrapComponent =
  (Providers?: React.FC<{ children: React.ReactNode }>) =>
  (Component: React.FC, options: Options = {}) => {
    return buildExtendedView({ Component, options, Providers });
  };

export default buildWrapComponent;
