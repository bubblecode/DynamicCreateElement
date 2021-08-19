# dynamic-create-element
![GitHub](https://img.shields.io/github/license/bubblecode/DynamicCreateElement)
![npm](https://img.shields.io/npm/v/dynamic-create-element)
![npm](https://img.shields.io/npm/dw/dynamic-create-element)
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
import { DynamicCreateElement } from "dynamic-create-element";
const Example = () => {
  return (
    <div {{ width: '100px', height: '100px', border: '1px solid #f00' }}>
      <DynamicCreateElement
        style={{ height: "100%" }}
        target={<div style={{ backgroundColor: 'greenyellow' }}></div>}
      >
        <div className="elementContainer"></div>
      </DynamicCreateElement>
    </div>
  );
};
export default Example;
```

### parameters

- `children` The component can only have one parent node, and new elements will be created under the parent node.

- `target` Rendered components

- `active` Activate the function of the current component (default `true`).

- `onBeforeElementCreate(event)`

  Called before the new component is created, through this callback function, you can implement some advanced operations.

  - `event.vDOM` Virtual DOM of the new component to be created.
  - `event.preventDefault()` After using this method, no new elements will be created after the operation (you can customize some operations).

- `onAfterElementCreate(children)`

  Called after the new component is created, returning the new react child component.
- `grid`

  use grid layout.
  - **columns**: Number of grid columns.
  - **rowHeight**: The row height of elements in the grid layout.
  - **space**: The spacing between elements (pixels, default value 10)
  - **freezeWidth**: The width of the container of the grid layout. If not set this argument, the current width of the container will default to the so-called total width of the child node.

> 🚩 More useful features will be added in the future. 

### dependencies

```text
react: ^16.10.2
react-dom: ^16.10.2
```

### Notice
In the next major version (1.0.*), we will refactor the components and make major destructive changes. At the same time, we will support more rich scenes and functions.