"use strict";

exports.__esModule = true;
exports.transferStep = transferStep;
exports.transferPixel = transferPixel;
exports.transferShape = transferShape;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _api = require("./api");

require("./DynamicCreateElement.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function transferStep(exactLength, unitLength, space) {
  var step = Math.round(exactLength / unitLength);
  return [step, transferPixel(step, unitLength) + space];
}

function transferPixel(step, unitLength) {
  return unitLength * step;
}

function transferShape(exactLength, unitLength, space) {
  var step = Math.round(exactLength / unitLength);
  return [step === 0 ? step + 1 : step, transferPixel(step, unitLength - space) + space * (step - 1)];
}

var DynamicCreateElement = /*#__PURE__*/function (_Component) {
  _inheritsLoose(DynamicCreateElement, _Component);

  function DynamicCreateElement(_props) {
    var _this;

    _this = _Component.call(this, _props) || this;

    _this.initGrid = function () {
      if (!_this.props.grid) {
        return;
      }

      try {
        var _this$props$grid = _this.props.grid,
            columns = _this$props$grid.columns,
            rowHeight = _this$props$grid.rowHeight,
            _this$props$grid$spac = _this$props$grid.space,
            space = _this$props$grid$spac === void 0 ? 10 : _this$props$grid$spac,
            _this$props$grid$free = _this$props$grid.freezeWidth,
            freezeWidth = _this$props$grid$free === void 0 ? 0 : _this$props$grid$free;
        var contentWidth = freezeWidth ? freezeWidth : _reactDom["default"].findDOMNode(_this.outerContentRef.current).offsetWidth;
        var colWidth = Math.floor((contentWidth - (columns + 1) * space) / columns);

        _this.setState({
          gridConfig: {
            rowHeight: rowHeight,
            colWidth: colWidth,
            space: space,
            contentWidth: contentWidth
          }
        });
      } catch (e) {
        throw new Error("初始化DCE网格失败！");
      }
    };

    _this.generateKey = function (key) {
      if (key) {
        return key;
      }

      return "r__dce__" + +new Date();
    };

    _this.fromPropsGetChildrenList = function (props) {
      var children = props.children;

      if (children && typeof children === "object") {
        if (Array.isArray(children)) {
          return props.children;
        }

        return [props.children];
      } else {
        return [];
      }
    };

    _this.onElementCreateStart = function (e) {
      if (!_this.props.active) return;
      e.stopPropagation();

      if (_this.state.curStep !== _api.CREATE_STATE.FINISH || e.nativeEvent.buttons !== 1) {
        return;
      }

      if (!_this.props.grid) {
        _this.setState({
          curStep: _api.CREATE_STATE.START,
          startX: e.nativeEvent.clientX,
          startY: e.nativeEvent.clientY
        }, function () {
          var ghostDOM = _reactDom["default"].findDOMNode(_this.ghostRef.current);

          var _ghostDOM$getBounding = ghostDOM.getBoundingClientRect(),
              x = _ghostDOM$getBounding.x,
              y = _ghostDOM$getBounding.y;

          ghostDOM.style.transform = "translate(" + (_this.state.startX - x) + "px, " + (_this.state.startY - y) + "px)";
        });
      } else {
        var _this$state$gridConfi = _this.state.gridConfig,
            colWidth = _this$state$gridConfi.colWidth,
            space = _this$state$gridConfi.space,
            rowHeight = _this$state$gridConfi.rowHeight;

        var _ReactDOM$findDOMNode = _reactDom["default"].findDOMNode(_this.outerContentRef.current).getBoundingClientRect(),
            x = _ReactDOM$findDOMNode.x,
            y = _ReactDOM$findDOMNode.y;

        var _transferStep = transferStep(e.nativeEvent.clientX - x, space + colWidth, space),
            stepX = _transferStep[0],
            exactX = _transferStep[1];

        var _transferStep2 = transferStep(e.nativeEvent.clientY - y, space + rowHeight, space),
            stepY = _transferStep2[0],
            exactY = _transferStep2[1];

        _this.setState({
          curStep: _api.CREATE_STATE.START,
          startX: exactX,
          startY: exactY,
          g_x: stepX,
          g_y: stepY
        }, function () {
          var ghostDOM = _reactDom["default"].findDOMNode(_this.ghostRef.current);

          ghostDOM.style.transform = "translate(" + exactX + "px, " + exactY + "px)";
        });
      }
    };

    _this.onDrawingELement = function (e) {
      var _this$state = _this.state,
          curStep = _this$state.curStep,
          _this$state$gridConfi2 = _this$state.gridConfig,
          space = _this$state$gridConfi2.space,
          colWidth = _this$state$gridConfi2.colWidth,
          rowHeight = _this$state$gridConfi2.rowHeight;

      if (!_this.props.active || curStep !== _api.CREATE_STATE.START && curStep !== _api.CREATE_STATE.DRAWING || e.nativeEvent.buttons !== 1) {
        return;
      }

      _this.setState({
        curStep: _api.CREATE_STATE.DRAWING
      });

      var _e$nativeEvent = e.nativeEvent,
          clientX = _e$nativeEvent.clientX,
          clientY = _e$nativeEvent.clientY;

      var ghostDOM = _reactDom["default"].findDOMNode(_this.ghostRef.current);

      if (!_this.props.grid) {
        ghostDOM.style.width = clientX - _this.state.startX + "px";
        ghostDOM.style.height = clientY - _this.state.startY + "px";
      } else {
        var _ReactDOM$findDOMNode2 = _reactDom["default"].findDOMNode(_this.outerContentRef.current).getBoundingClientRect(),
            x = _ReactDOM$findDOMNode2.x,
            y = _ReactDOM$findDOMNode2.y;

        var _transferShape = transferShape(clientX - x - _this.state.startX, space + colWidth, space),
            stepX = _transferShape[0],
            moveX = _transferShape[1];

        var _transferShape2 = transferShape(clientY - y - _this.state.startY, space + rowHeight, space),
            stepY = _transferShape2[0],
            moveY = _transferShape2[1];

        _this.setState({
          g_w: stepX,
          g_h: stepY
        });

        ghostDOM.style.width = moveX + "px";
        ghostDOM.style.height = moveY + "px";
      }
    };

    _this.onElementCreateFinish = function (e) {
      if (!_this.props.active || _this.state.curStep !== _api.CREATE_STATE.DRAWING) {
        return;
      }

      _this.setState({
        curStep: _api.CREATE_STATE.FINISH
      });

      var attr = _this.resetGhost();

      _this.onCreateElement(attr);
    };

    _this.onCreateElement = function (attr) {
      var transform = attr.transform,
          width = attr.width,
          height = attr.height;

      if (width === "0px" || height === "0px") {
        // 暂不支持创建高或宽为0的元素
        return;
      }

      var newNode = /*#__PURE__*/_react["default"].cloneElement(_this.props.target, {
        key: _this.generateKey(),
        style: _objectSpread(_objectSpread({}, _this.props.target.props.style), {}, {
          transform: transform,
          width: width,
          height: height,
          position: "absolute",
          top: "0",
          left: "0"
        }),
        layout: _this.props.grid ? {
          x: _this.state.g_x,
          y: _this.state.g_y,
          h: _this.state.g_h,
          w: _this.state.g_w
        } : null
      }); // 执行对外暴露的回调函数


      _this.props.onBeforeElementCreate({
        preventDefault: _this.preventDefault,
        vDOM: newNode
      });

      if (!_this.isEventPrevent.current) {
        // 执行节点创建
        var _this$state2 = _this.state,
            children = _this$state2.children,
            props = _this$state2.children.props;

        _this.setState({
          children: _objectSpread(_objectSpread({}, children), {}, {
            props: _objectSpread(_objectSpread({}, props), {}, {
              children: [].concat(_this.fromPropsGetChildrenList(props), [newNode]),
              layout: [].concat(props.layout, [_objectSpread({
                i: newNode.key
              }, newNode.props.layout)])
            })
          })
        }, function () {
          _this.props.onAfterElementCreate(newNode, _this.state.children);
        });
      }
    };

    _this.preventDefault = function () {
      _this.isEventPrevent.current = true;
    };

    _this.resetGhost = function () {
      var ghostDOM = _reactDom["default"].findDOMNode(_this.ghostRef.current);

      var _ghostDOM$style = ghostDOM.style,
          transform = _ghostDOM$style.transform,
          width = _ghostDOM$style.width,
          height = _ghostDOM$style.height;
      ghostDOM.style.transform = "translate(0px, 0px)";
      ghostDOM.style.width = "0px";
      ghostDOM.style.height = "0px";
      return {
        transform: transform,
        width: width,
        height: height
      };
    };

    _this.ghostRef = /*#__PURE__*/_react["default"].createRef();
    _this.outerContentRef = /*#__PURE__*/_react["default"].createRef();
    _this.isEventPrevent = /*#__PURE__*/_react["default"].createRef();
    _this.isEventPrevent.current = false;
    _this.state = {
      curStep: _api.CREATE_STATE.FINISH,
      startX: 0,
      startY: 0,
      children: _props.children,
      gridConfig: {
        rowHeight: 0,
        colWidth: 0,
        space: 10,
        contentWidth: 0
      },
      g_x: 0,
      g_y: 0,
      g_w: 0,
      g_h: 0
    };
    return _this;
  }

  var _proto = DynamicCreateElement.prototype;

  _proto.componentDidMount = function componentDidMount() {
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
  ;

  _proto.render = function render() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "dynamiccreateelement__outer",
      ref: this.outerContentRef,
      style: this.props.style,
      onMouseDown: this.onElementCreateStart,
      onMouseMove: this.onDrawingELement,
      onMouseUp: this.onElementCreateFinish
    }, this.state.children, /*#__PURE__*/_react["default"].createElement("div", {
      className: "__ghost",
      ref: this.ghostRef
    }));
  };

  return DynamicCreateElement;
}(_react.Component);

DynamicCreateElement.defaultProps = {
  active: true,
  grid: null,
  target: /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      backgroundColor: "blue"
    }
  }),
  onBeforeElementCreate: function onBeforeElementCreate(event) {
    return event;
  },
  onAfterElementCreate: function onAfterElementCreate(children) {
    return children;
  }
};
DynamicCreateElement.propTypes = {
  children: _propTypes["default"].element,
  target: _propTypes["default"].element,
  // 目标元素，ReactNode，默认Div
  onBeforeElementCreate: _propTypes["default"].func,
  // 回调函数，当节点被创建前
  onAfterElementCreate: _propTypes["default"].func,
  // 回调函数，当节点被创建后
  active: _propTypes["default"].bool,
  // 是否激活当前控件
  grid: _propTypes["default"].object // 网格化

};
var _default = DynamicCreateElement;
exports["default"] = _default;