import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked toggled = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	showDialog() {
		this.#debug?.('showDialog: ON BUTTON CLICK');
	}

	@action
	toggleIconButton() {
		this.toggled = !this.toggled;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('application:test-app');
	// #endregion
}
