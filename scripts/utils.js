define(function(require, exports, module) {
	return {
		/**
		 * Creates new DOM element with given name, class name 
		 * and attributes
		 * @param  {String} name      Element name
		 * @param  {String} className Class name
		 * @param  {Object} attrs     Hash with attributes to add to element
		 * @return {Element}
		 */
		el: function(name, className, attrs) {
			if (typeof className === 'object') {
				attrs = className;
				className = null;
			}

			var elem = document.createElement(name);
			if (className) {
				elem.className = className;
			}

			if (attrs) {
				Object.keys(attrs).forEach(function(name) {
					elem.setAttribute(name, attrs[name]);
				});
			}

			return elem;
		},

		closest: function(elem, test) {
			if (!elem) {
				return;
			}

			var cond = false;
			do {
				if (typeof test === 'function') {
					cond = test(elem);
				} else {
					cond = elem.classList.contains(test)
				}

				if (cond) {
					return elem;
				}

				elem = elem.parentNode;
			} while (elem && elem !== document);
		},

		findActionTrigger: function(elem) {
			var trigger = this.closest(elem, function(el) {
				return el.getAttribute('data-action');
			});

			if (trigger) {
				return {
					action: trigger.getAttribute('data-action'),
					elem: trigger
				};
			}
		},

		extend: function(obj) {
			for (var i = 1, il = arguments.length, src; i < il; i++) {
				src = arguments[i];
				if (!src) {
					continue;
				}

				for (var p in src) if (src.hasOwnProperty(p)) {
					obj[p] = src[p];
				}
			}

			return obj;
		},

		defaults: function(obj, defs) {
			return this.extend({}, defs || {}, obj || {});
		},

		throttle: function(func, wait, options) {
			var context, args, result;
			var timeout = null;
			var previous = 0;
			options || (options = {});
			var later = function() {
				previous = options.leading === false ? 0 : Date.now();
				timeout = null;
				result = func.apply(context, args);
				context = args = null;
			};

			return function() {
				var now = Date.now();
				if (!previous && options.leading === false) previous = now;
				var remaining = wait - (now - previous);
				context = this;
				args = arguments;
				if (remaining <= 0) {
					clearTimeout(timeout);
					timeout = null;
					previous = now;
					result = func.apply(context, args);
					context = args = null;
				} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}
				return result;
			};
		},
		debounce: function(func, wait, immediate) {
			var timeout, args, context, timestamp, result;

			var later = function() {
				var last = Date.now() - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						context = args = null;
					}
				}
			};

			return function() {
				context = this;
				args = arguments;
				timestamp = Date.now();
				var callNow = immediate && !timeout;
				if (!timeout) {
					timeout = setTimeout(later, wait);
				}
				
				if (callNow) {
					result = func.apply(context, args);
					context = args = null;
				}

				return result;
			};
		}
	};
});