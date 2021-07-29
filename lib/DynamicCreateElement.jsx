import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DynamicCreateElement extends Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return <div style={this.props.style}>{this.props.children}</div>;
  }
}
