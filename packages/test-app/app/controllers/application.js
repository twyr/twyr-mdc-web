import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked navIconElement = null;
	@tracked palette = 'primary';
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
	storeNavigationIconElement(navIconElement) {
		this.#debug?.('storeNavigationIconElement: ', navIconElement);
		this.navIconElement = navIconElement;
	}

	@action
	closeChip(event) {
		this.#debug?.('closeChip', event?.detail);
	}

	@action
	processCheckboxEvent(event) {
		this.#debug?.('processCheckboxEvent', event?.detail);

		setTimeout(() => {
			const newStatus = Object?.assign?.({}, event?.detail?.status);
			const checkboxControls = event?.detail?.controls;

			checkboxControls?.setState?.(newStatus);
		}, 2000);
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
