'use strict';

module.exports = {
	plugins: ['ember-template-lint-plugin-prettier'],

	extends: ['recommended', 'ember-template-lint-plugin-prettier:recommended'],

	ignore: [
		'twyr-mdc-web/packages/test-app/app/templates/first-steps.hbs',
		'test-app/app/templates/first-steps.hbs',
		'app/templates/first-steps.hbs'
	]
};
