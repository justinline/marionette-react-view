# Marionette React View tooling

## What is this?

Found yourself working on an old Marionettejs app? Want to migrate to react? Can't just rewrite the whole thing?

This might be for you!

This small repo provides some utilities for glue-code that can render react components inside of marionette applications.

This allows you to re-use stuff from your existing react design systems with ease.

## Usage

### ReactView & wrapComponent

`ReactView` is an extended Marionette `View` class with some logic for mapping options to props and such.
The API to create a `ReactView` is via the `buildWrapComponent` function.

Firstly you'll want to create and export your own function `wrapComponent` utility where you can pass in any necessary providers.

Example:
```tsx
// utils/wrapComponent.ts
import { buildWrapComponent } from 'marionette-react-view'

type CustomOptions = {
    store: typeof myReduxStore
};

export const wrapComponent = buildWrapComponent(
    ({options, children}: {options: CustomOptions, children: React.ReactNode}) => (
        <ThemeProvider>
            <Provider store={options.store}>
                {children}
            </Provider>
        </ThemeProvider>
    )
)
```

then you can use this in your existing marionette views, as follows:

```js
import {wrapComponent} from 'utils/wrapComponent';
import template from 'lodash/template';
import z from 'zod'

const MyButtonPropsSchema = z.object({text: z.string()});

const MyButtonView = wrapComponent(
    (props: z.infer<typeof MyButtonPropsSchema>) => <button>{props.text}</button>, 
    { schema: MyButtonPropsSchema } // This is optional runtime type validation
);

export default Mn.View.extend({
    template: template('<div class="example-react-region"/>'),
    regions: {
        reactRegion: '.example-react-region',
    },
    onRender() {
        this.showChildView('reactRegion', new MyButtonView({props: {text: 'Click me!'}}))
    }
})
```


### extendMarionetteViews & showReactView

This library also exports a method that can be attached to `Mn.View` called `showReactView`.
This replaces `showChildView` with a similar functionality, but the key difference is that it replaces
the element of the region the `ReactView` get's rendered into. As a visual example:

```html
<div class="el">
  <div class="template-region">
    <p>react content</p>
  </div>
</div>
```

becomes

```html
<div class="el">
    <p class="template-region">react content</p>
</div>
```

You can see the middle `<div>` in the example got replaced by the `<p>` which is the react component