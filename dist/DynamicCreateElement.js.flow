import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CREATE_STATE } from "./api";
import "./DynamicCreateElement.css";

export function transferStep(exactLength, unitLength, space) {
  const step = Math.round(exactLength / unitLength);
  return [step, transferPixel(step, unitLength) + space];
}

export function transferPixel(step, unitLength) {
  return unitLength * step;
}

export function transferShape(exactLength, unitLength, space) {
  const step = Math.round(exactLength / unitLength);
  return [
    step === 0 ? step + 1 : step,
    transferPixel(step, unitLength - space) + space * (step - 1),
  ];
}

class DynamicCreateElement extends Component {
  constructor(props) {
    super(props);
    this.ghostRef = React.createRef();
    this.outerContentRef = React.createRef();
    this.isEventPrevent = React.createRef();
    this.isEventPrevent.current = false;
    this.state = {
      curStep: CREATE_STATE.FINISH,
      startX: 0,
      startY: 0,
      children: props.children,
      gridConfig: {
        rowHeight: 0,
        colWidth: 0,
        space: 10,
        contentWidth: 0,
      },
      g_x: 0,
      g_y: 0,
      g_w: 0,
      g_h: 0,
    };
  }

  componentDidMount() {
    if (this.props.grid) {
      this.initGrid();
    }
  }

  /**
   * grid {
   *   columns: number 分割的列数
   *   rowHeight: number 行数
   *   space: number 行间距（默认10px）
   * }
   */
  initGrid = () => {
    if (!this.props.grid) {
      return;
    }
    try {
      const {
        columns,
        rowHeight,
        space = 10,
        freezeWidth = 0,
      } = this.props.grid;
      const contentWidth = freezeWidth
        ? freezeWidth
        : ReactDOM.findDOMNode(this.outerContentRef.current).offsetWidth;
      const colWidth = Math.floor(
        (contentWidth - (columns + 1) * space) / columns
      );

      this.setState({
        gridConfig: {
          rowHeight,
          colWidth,
          space,
          contentWidth,
        },
      });
    } catch (e) {
      throw new Error("初始化DCE网格失败！");
    }
  };

  generateKey = (key) => {
    if (key) {
      return key;
    }
    return `r__dce__${+new Date()}`;
  };

  /**
   * 该函数用于查找要创建元素所在容器的props，因此会返回一个Array。
   * @param {object} props
   * @returns Array
   */
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
    if (!this.props.active) return;
    e.stopPropagation();
    if (
      this.state.curStep !== CREATE_STATE.FINISH ||
      e.nativeEvent.buttons !== 1
    ) {
      return;
    }
    if (!this.props.grid) {
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
    } else {
      const {
        gridConfig: { colWidth, space, rowHeight },
      } = this.state;
      const { x, y } = ReactDOM.findDOMNode(
        this.outerContentRef.current
      ).getBoundingClientRect();
      const [stepX, exactX] = transferStep(
        e.nativeEvent.clientX - x,
        space + colWidth,
        space
      );
      const [stepY, exactY] = transferStep(
        e.nativeEvent.clientY - y,
        space + rowHeight,
        space
      );
      this.setState(
        {
          curStep: CREATE_STATE.START,
          startX: exactX,
          startY: exactY,
          g_x: stepX,
          g_y: stepY,
        },
        () => {
          const ghostDOM = ReactDOM.findDOMNode(this.ghostRef.current);
          ghostDOM.style.transform = `translate(${exactX}px, ${exactY}px)`;
        }
      );
    }
  };

  // 按住拖动
  onDrawingELement = (e) => {
    const {
      curStep,
      gridConfig: { space, colWidth, rowHeight },
    } = this.state;
    if (
      !this.props.active ||
      (curStep !== CREATE_STATE.START && curStep !== CREATE_STATE.DRAWING) ||
      e.nativeEvent.buttons !== 1
    ) {
      return;
    }
    this.setState({ curStep: CREATE_STATE.DRAWING });
    const { clientX, clientY } = e.nativeEvent;
    const ghostDOM = ReactDOM.findDOMNode(this.ghostRef.current);

    if (!this.props.grid) {
      ghostDOM.style.width = `${clientX - this.state.startX}px`;
      ghostDOM.style.height = `${clientY - this.state.startY}px`;
    } else {
      const { x, y } = ReactDOM.findDOMNode(
        this.outerContentRef.current
      ).getBoundingClientRect();
      const [stepX, moveX] = transferShape(
        clientX - x - this.state.startX,
        space + colWidth,
        space
      );
      const [stepY, moveY] = transferShape(
        clientY - y - this.state.startY,
        space + rowHeight,
        space
      );
      this.setState({ g_w: stepX, g_h: stepY });
      ghostDOM.style.width = `${moveX}px`;
      ghostDOM.style.height = `${moveY}px`;
    }
  };

  // 松开鼠标
  onElementCreateFinish = (e) => {
    if (!this.props.active || this.state.curStep !== CREATE_STATE.DRAWING) {
      return;
    }
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
      layout: this.props.grid
        ? {
            x: this.state.g_x,
            y: this.state.g_y,
            h: this.state.g_h,
            w: this.state.g_w,
          }
        : null,
    });
    // 执行对外暴露的回调函数
    this.props.onBeforeElementCreate({
      preventDefault: this.preventDefault,
      vDOM: newNode,
    });
    if (!this.isEventPrevent.current) {
      // 执行节点创建
      const {
        children,
        children: { props },
      } = this.state;
      this.setState(
        {
          children: {
            ...children,
            props: {
              ...props,
              children: [...this.fromPropsGetChildrenList(props), newNode],
              layout: [
                ...props.layout,
                { i: newNode.key, ...newNode.props.layout },
              ],
            },
          },
        },
        () => {
          this.props.onAfterElementCreate(newNode, this.state.children);
        }
      );
    }
  };

  preventDefault = () => {
    this.isEventPrevent.current = true;
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
        onMouseDown={this.onElementCreateStart}
        onMouseMove={this.onDrawingELement}
        onMouseUp={this.onElementCreateFinish}
      >
        {this.state.children}
        <div className="__ghost" ref={this.ghostRef}></div>
      </div>
    );
  }
}

DynamicCreateElement.defaultProps = {
  active: true,
  grid: null,
  target: <div style={{ backgroundColor: "blue" }}></div>,
  onBeforeElementCreate: function (event) {
    return event;
  },
  onAfterElementCreate: function (children) {
    return children;
  },
};

DynamicCreateElement.propTypes = {
  children: PropTypes.element,
  target: PropTypes.element, // 目标元素，ReactNode，默认Div
  onBeforeElementCreate: PropTypes.func, // 回调函数，当节点被创建前
  onAfterElementCreate: PropTypes.func, // 回调函数，当节点被创建后
  active: PropTypes.bool, // 是否激活当前控件
  grid: PropTypes.object, // 网格化
};

export default DynamicCreateElement;
