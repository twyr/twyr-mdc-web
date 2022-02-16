import debugLogger from 'ember-debug-logger';

export const isDisabled = function isDisabled(element) {
	const debug = debugLogger('util:dom-element-attributes');
	debug(`checking if disabled: `, element);

	do {
		if (!element?.tagName || element?.tagName?.toUpperCase() === 'BODY')
			break;

		if (element?.hasAttribute?.('disabled')) {
			return true;
		}

		element = element?.parentNode;
	} while (element);

	return false;
};
