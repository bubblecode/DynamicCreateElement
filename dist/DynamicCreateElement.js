"use strict";

exports.__esModule = true;
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

var DynamicCreateElement = /*#__PURE__*/function (_Component) {
  _inheritsLoose(DynamicCreateElement, _Component);

  function DynamicCreateElement(_props) {
    var _this;

    _this = _Component.call(this, _props) || this;

    _this.generateKey = function (key) {
      if (key) {
        return key;
      }

      return "r__dce__" + +new Date();
    };

    _this.getBoundNode = function (props) {
      var bindTo = props.bindTo,
          children = props.children;

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
          return _this.outerContentRef.current;
        }
      }

      throw new TypeError("cannot find react node to bind.");
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
      e.stopPropagation();

      if (_this.state.curStep !== _api.CREATE_STATE.FINISH || e.nativeEvent.buttons !== 1) {
        return;
      }

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
    };

    _this.onDrawingELement = function (e) {
      var curStep = _this.state.curStep;

      if (curStep !== _api.CREATE_STATE.START && curStep !== _api.CREATE_STATE.DRAWING || e.nativeEvent.buttons !== 1) {
        return;
      }

      _this.setState({
        curStep: _api.CREATE_STATE.DRAWING
      });

      var _e$nativeEvent = e.nativeEvent,
          clientX = _e$nativeEvent.clientX,
          clientY = _e$nativeEvent.clientY;

      var ghostDOM = _reactDom["default"].findDOMNode(_this.ghostRef.current);

      ghostDOM.style.width = clientX - _this.state.startX + "px";
      ghostDOM.style.height = clientY - _this.state.startY + "px";
    };

    _this.onElementCreateFinish = function (e) {
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
        })
      }); // 执行对外暴露的回调函数


      _this.props.onBeforeElementCreate({
        preventDefault: _this.preventDefault,
        vDOM: newNode
      });

      if (!_this.state.preventDefault) {
        // 执行节点创建
        var _this$state = _this.state,
            children = _this$state.children,
            props = _this$state.children.props;

        _this.setState({
          children: _objectSpread(_objectSpread({}, children), {}, {
            props: _objectSpread(_objectSpread({}, props), {}, {
              children: [].concat(_this.fromPropsGetChildrenList(props), [newNode])
            })
          })
        }, function () {
          _this.props.onAfterElementCreate(_this.state.children);
        });
      }
    };

    _this.preventDefault = function () {
      _this.setState({
        preventDefault: true
      });
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
    _this.state = {
      curStep: _api.CREATE_STATE.FINISH,
      startX: 0,
      startY: 0,
      children: _this.getBoundNode(_props),
      preventDefault: false
    };
    return _this;
  }

  var _proto = DynamicCreateElement.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.setState({});
  };

  _proto.render = function render() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "dynamiccreateelement__outer",
      ref: this.outerContentRef,
      style: this.props.style,
      onMouseDown: this.props.active && this.onElementCreateStart,
      onMouseMove: this.props.active && this.onDrawingELement,
      onMouseUp: this.props.active && this.onElementCreateFinish
    }, this.state.children, /*#__PURE__*/_react["default"].createElement("div", {
      className: "__ghost",
      ref: this.ghostRef
    }));
  };

  return DynamicCreateElement;
}(_react.Component);

DynamicCreateElement.defaultProps = {
  active: true,
  rasterized: false,
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
  children: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].array]),
  bindTo: _propTypes["default"].oneOfType([// 添加到哪个元素里面（reactVDOM）,不写则默认是第一个元素
  _propTypes["default"].shape({
    current: _propTypes["default"].object
  })]),
  target: _propTypes["default"].element,
  // 目标元素，ReactNode，默认Div
  onBeforeElementCreate: _propTypes["default"].func,
  // 回调函数，当节点被创建前
  onAfterElementCreate: _propTypes["default"].func,
  // 回调函数，当节点被创建后
  active: _propTypes["default"].bool,
  // 是否激活当前控件
  __rasterized: _propTypes["default"].bool // 栅格化（保留）

};
var _default = DynamicCreateElement;
exports["default"] = _default;