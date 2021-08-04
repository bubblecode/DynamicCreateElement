
'use strict';
module.exports = function() {
  throw new Error("Please use \x1B[3mimport { DynamicCreateElement } from 'dynamic-create-element'\x1B[0m instead.");
};

module.exports.DynamicCreateElement = require('./dist/DynamicCreateElement').default;