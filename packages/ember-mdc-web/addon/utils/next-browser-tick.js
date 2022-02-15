import debugLogger from 'ember-debug-logger';

import { Promise } from 'rsvp';

export const nextBrowserTick = function nextBrowserTick() {
	const debug = debugLogger('util:next-browser-tick');
	debug(`Requesting Animation Frame from thhe Window`);

	return new Promise((resolve) => {
		window.requestAnimationFrame(() => {
			debug(`Got Animation Frame from thhe Window`);
			resolve();
		});
	});
};
