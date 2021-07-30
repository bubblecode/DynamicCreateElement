import React, { useState, createRef, Fragment } from "react";
import ReactDOM from "react-dom";
import DynamicCreateElement from "../lib/DynamicCreateElement";
import "./index.css";

const Example = (props) => {
  const [value, setValue] = useState("p");
  const panelRef = createRef();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const renderTarget = (value) => {
    switch (value) {
      case "p":
        return <p>hello, world</p>;
      case "green_div":
        return <div style={{ backgroundColor: "greenyellow" }}></div>;
      case "input":
        return <input type="text" />;
      case "button":
        return <button onClick={(e) => alert("Just enjoy it!")}>submit</button>;
      default:
        break;
    }
    return <div></div>;
  };

  return (
    <Fragment>
      <div className="outter-box">
        <DynamicCreateElement
          style={{ height: "100%" }}
          bindTo={panelRef}
          target={renderTarget(value)}
        >
          <div ref={panelRef} className="inner-box"></div>
          <p>enjoy it</p>
        </DynamicCreateElement>
      </div>
      <br />
      <div>
        <div>
          <input
            type="radio"
            onChange={onChange}
            value="p"
            checked={value === "p"}
          />
          <label for="c1">&lt;p&gt; with a piece of text</label>
        </div>
        <div>
          <input
            type="radio"
            onChange={onChange}
            value="green_div"
            checked={value === "green_div"}
          />
          <label for="c2">green &lt;div&gt;</label>
        </div>
        <div>
          <input
            type="radio"
            onChange={onChange}
            value="input"
            checked={value === "input"}
          />
          <label for="c3">text type &lt;input&gt;</label>
        </div>
        <div>
          <input
            type="radio"
            onChange={onChange}
            value="button"
            checked={value === "button"}
          />
          <label for="c3">&lt;button&gt;</label>
        </div>
      </div>
    </Fragment>
  );
};

ReactDOM.render(<Example />, document.getElementById("root"));
