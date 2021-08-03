
'use strict';
module.exports = function() {
  throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
};

module.exports.DynamicCreateElement = require('./dist/DynamicCreateElement').default;