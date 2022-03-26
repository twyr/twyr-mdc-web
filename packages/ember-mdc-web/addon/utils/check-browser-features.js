// Taken from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/dom/passiveeventlisteners.js
/* eslint-disable */
import debugLogger from 'ember-debug-logger';

const supportsPassiveEventListeners =
	(function supportsPassiveEventListeners() {
		const debug = debugLogger('util:check-browser-features');
		let supportsPassiveOption = false;

		try {
			let opts = Object.defineProperty({}, 'passive', {
				get: function () {
					supportsPassiveOption = true;
					return supportsPassiveOption;
				}
			});

			const noop = function () {};

			window.addEventListener('testPassiveEventSupport', noop, opts);
			window.removeEventListener('testPassiveEventSupport', noop, opts);
		} catch (err) {}

		debug(`supports passive listener: ${supportsPassiveOption}`);
		return supportsPassiveOption;
	})();

export default supportsPassiveEventListeners;
