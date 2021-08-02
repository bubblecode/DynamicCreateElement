import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CREATE_STATE } from "./api";
import "./css/DynamicCreateElement.css";

export default class DynamicCreateElement extends Component {
  constructor(props) {
    super(props);
    this.ghostRef = React.createRef();
    this.outerContentRef = React.createRef();
    this.state = {
      curStep: CREATE_STATE.FINISH,
      startX: 0,
      startY: 0,
      children: this.getBoundNode(props),
      preventDefault: false,
    };
  }

  componentDidMount() {
    this.setState({});
  }

  generateKey = (key) => {
    if (key) {
      return key;
    }
    return `r__dce__${+new Date()}`;
  };

  getBoundNode = (props) => {
    const { bindTo, children } = props;
    if (bindTo && Object(bindTo).current === "object") {
      return bindTo.current;
    }
    if (children) {
      if (Array.isArray(children)) {
        return children[0];
      }
      if (typeof children === "object") {
        return children;
      }
      if (typeof children === "string") {
        return this.outerContentRef.current;
      }
    }
    throw new TypeError("cannot find react node to bind.");
  };

  fromPropsGetChildrenList = (props) => {
    const { children } = props;
    if (children && typeof children === "object") {
      if (Array.isArray(children)) {
        return props.children;
      }
      return [props.children];
    } else {
      return [];
    }
  };

  // 按下左键
  onElementCreateStart = (e) => {
    e.stopPropagation();
    if (
      this.state.curStep !== CREATE_STATE.FINISH ||
      e.nativeEvent.buttons !== 1
    ) {
      return;
    }
    this.setState(
      {
        curStep: CREATE_STATE.START,
        startX: e.nativeEvent.clientX,
        startY: e.nativeEvent.clientY,
      },
      () => {
        const ghostDOM = ReactDOM.findDOMNode(this.ghostRef.current);
        const { x, y } = ghostDOM.getBoundingClientRect();
        ghostDOM.style.transform = `translate(${this.state.startX - x}px, ${
          this.state.startY - y
        }px)`;
      }
    );
  };

  // 按住拖动
  onDrawingELement = (e) => {
    const { curStep } = this.state;
    if (
      (curStep !== CREATE_STATE.START && curStep !== CREATE_STATE.DRAWING) ||
      e.nativeEvent.buttons !== 1
    ) {
      return;
    }
    this.setState({ curStep: CREATE_STATE.DRAWING });
    const { clientX, clientY } = e.nativeEvent;
    const ghostDOM = ReactDOM.findDOMNode(this.ghostRef.current);
    ghostDOM.style.width = `${clientX - this.state.startX}px`;
    ghostDOM.style.height = `${clientY - this.state.startY}px`;
  };

  // 松开鼠标
  onElementCreateFinish = (e) => {
    this.setState({ curStep: CREATE_STATE.FINISH });
    const attr = this.resetGhost();
    this.onCreateElement(attr);
  };

  /**
   * 创建新元素
   * @param {object} attr
   * @param {string} attr.posX
   * @param {string} attr.posY
   * @param {string} attr.transform
   */
  onCreateElement = (attr) => {
    const { transform, width, height } = attr;
    if (width === "0px" || height === "0px") {
      // 暂不支持创建高或宽为0的元素
      return;
    }
    const newNode = React.cloneElement(this.props.target, {
      key: this.generateKey(),
      style: {
        ...this.props.target.props.style,
        transform,
        width,
        height,
        position: "absolute",
        top: "0",
        left: "0",
      },
    });
    // 执行对外暴露的回调函数
    this.props.onBeforeElementCreate({
      preventDefault: this.preventDefault,
      vDOM: newNode,
    });
    if (!this.state.preventDefault) {
      // 执行节点创建
      const {
        children,
        children: { props },
      } = this.state;
      this.setState({
        children: {
          ...children,
          props: {
            ...props,
            children: [...this.fromPropsGetChildrenList(props), newNode],
          },
        },
      }, () => {
        this.props.onAfterElementCreate(this.state.children);
      });
    }
  };

  preventDefault = () => {
    this.setState({ preventDefault: true });
  };

  resetGhost = () => {
    const ghostDOM = ReactDOM.findDOMNode(this.ghostRef.current);
    const { transform, width, height } = ghostDOM.style;
    ghostDOM.style.transform = `translate(0px, 0px)`;
    ghostDOM.style.width = "0px";
    ghostDOM.style.height = "0px";
    return { transform, width, height };
  };

  render() {
    return (
      <div
        className="dynamiccreateelement__outer"
        ref={this.outerContentRef}
        style={this.props.style}
        onMouseDown={this.props.active && this.onElementCreateStart}
        onMouseMove={this.props.active && this.onDrawingELement}
        onMouseUp={this.props.active && this.onElementCreateFinish}
      >
        {this.state.children}
        <div className="__ghost" ref={this.ghostRef}></div>
      </div>
    );
  }
}

DynamicCreateElement.defaultProps = {
  active: true,
  rasterized: false,
  target: <div style={{ backgroundColor: "blue" }}></div>,
  onBeforeElementCreate: function (event) {
    return event;
  },
  onAfterElementCreate: function (children) {
    return children;
  },
};

DynamicCreateElement.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  bindTo: PropTypes.oneOfType([
    // 添加到哪个元素里面（reactVDOM）,不写则默认是第一个元素
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  target: PropTypes.element,   // 目标元素，ReactNode，默认Div
  onBeforeElementCreate: PropTypes.func, // 回调函数，当节点被创建前
  onAfterElementCreate: PropTypes.func, // 回调函数，当节点被创建后
  active: PropTypes.bool,      // 是否激活当前控件
  __rasterized: PropTypes.bool,  // 栅格化（保留）
};
