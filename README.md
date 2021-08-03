# dynamic-create-element
![GitHub](https://img.shields.io/github/license/bubblecode/DynamicCreateElement)
![npm](https://img.shields.io/npm/v/dynamic-create-element)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/bubblecode/DynamicCreateElement)
![GitHub top language](https://img.shields.io/github/languages/top/bubblecode/DynamicCreateElement)
![GitHub last commit](https://img.shields.io/github/last-commit/bubblecode/DynamicCreateElement)

A dynamically created element component based on react.🍻🍻🍻

![demo.gif](https://i.ibb.co/h9kwj9w/demo.gif)
### usage

```shell
$ npm install dynamic-create-element --registry=https://registry.npmjs.org
```

use in webpack

```jsx
import { createRef } from "react";
import { DynamicCreateElement } from "dynamic-create-element";
const Example = () => {
  const panelRef = createRef();
  return (
    <div {{ width: '100px', height: '100px', border: '1px solid #f00' }}>
      <DynamicCreateElement
        style={{ height: "100%" }}
        bindTo={panelRef}
        target={<div style={{ backgroundColor: 'greenyellow' }}></div>}
      >
        <div ref={panelRef}></div>
      </DynamicCreateElement>
    </div>
  );
};
export default Example;
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

> 🚩 More useful features will be added in the future. 

### dependencies

```text
react: ^17.0.2
react-dom: ^17.0.2
```

