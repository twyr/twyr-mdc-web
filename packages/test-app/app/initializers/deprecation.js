import debugLogger from 'ember-debug-logger';
import { registerDeprecationHandler } from '@ember/debug';

export function initialize(/* application */) {
	const debug = debugLogger('initializer:deprecation');
	registerDeprecationHandler((message, options, next) => {
		if (
			options?.id === 'ember-modifier.use-destroyables' &&
			options?.until === '4.0.0'
		)
			return;

		if (
			options?.id === 'ember-modifier.use-modify' &&
			options?.until === '4.0.0'
		)
			return;

		debug?.(`${message}: `, options);
		next();
	});
}

export default {
	initialize
};
