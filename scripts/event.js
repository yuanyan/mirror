/**
 * Global event bus
 */
define(function(require, exports, module) {
	var mixin = require('./eventMixin');
	var utils = require('./utils');
	return utils.extend({}, mixin);
});
