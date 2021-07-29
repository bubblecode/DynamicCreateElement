import React from "react";
import ReactDOM from "react-dom";
import DynamicCreateElement from "../lib/DynamicCreateElement";

const example = (
  <div
    style={{
      padding: "5px",
      width: "1200px",
      height: "600px",
    }}
  >
    <DynamicCreateElement style={{ height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: '5px',
          border: '1px solid #c03',
          borderRadius: '5px',
        }}
      >
        在这里进行测试
      </div>
    </DynamicCreateElement>
  </div>
);

ReactDOM.render(example, document.getElementById("root"));
