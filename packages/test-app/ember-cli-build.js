'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
	let app = new EmberApp(defaults, {
		// Add options here
		storeConfigInMeta: false,

		autoImport: {
			watchDependencies: '@twyr/ember-mdc-web'
		},

		babel: {
			plugins: [require.resolve('ember-auto-import/babel-plugin')]
		},

		'ember-freestyle': {
			includeStyles: false
		},

		sassOptions: {
			implementation: require('sass'),
			includePaths: ['node_modules']
		}
	});

	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.
	app.import(
		'node_modules/@mdi/font/fonts/materialdesignicons-webfont.woff2'
	);

	const { Webpack } = require('@embroider/webpack');
	return require('@embroider/compat').compatBuild(app, Webpack, {
		skipBabel: [
			{
				package: 'qunit'
			}
		]
	});
};
