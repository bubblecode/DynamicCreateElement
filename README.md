# DynamicCreateElement
A dynamically created element component based on react⭐⭐
### usage

```shell
$ npm install
```

run demo

```shell
$ npm run dev
```

use in webpack

```jsx
import React, { createRef } from "react";
import ReactDOM from "react-dom";
import DynamicCreateElement from "../lib/DynamicCreateElement";
const Example = () => {
  const panelRef = createRef();
  return (
    <div className="outter-box">
      <DynamicCreateElement
        style={{ height: "100%" }}
        bindTo={panelRef}
        target={<div style={{ backgroundColor: 'greenyellow' }}></div>}
      >
        <div ref={panelRef} className="inner-box"></div>
      </DynamicCreateElement>
    </div>
  );
};
```

### parameters

- `children` Components that want to use this feature

- `bindTo` Require a reactRef, the corresponding component can realize the function of dynamically adding elements, the default is the first child element under DynamicCreateElement.

- `target` Rendered components

- `onBeforeElementCreate(event)`

  Called before the new component is created, through this callback function, you can implement some advanced operations.

  - `event.vDOM` Virtual DOM of the new component to be created.
  - `event.preventDefault()` After using this method, no new elements will be created after the operation (you can customize some operations).

- `onAfterElementCreate(children)`

  Called after the new component is created, returning the new react child component.

> More useful features will be added in the future

### dependencies

```text
react: ^17.0.2
react-dom: ^17.0.2
```

