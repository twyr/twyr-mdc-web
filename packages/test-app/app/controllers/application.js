import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	@service('snackbarManager') alertManager;
	// #endregion

	// #region Tracked Attributes
	@tracked palette = 'error';
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers - Drawer / Sidebar
	@action
	storeNavigationIconControls(event) {
		this.#debug?.('storeNavigationIconControls: ', event?.detail);
		this.#navIconControls = event?.detail?.controls;

		if (!this.#sidebar) {
			this.#debug?.(
				'storeNavigationIconControls: no sidebar yet. nothing to do...'
			);
			return;
		}

		this.#debug?.('storeNavigationIconControls: registering sidebar...');
	}

	@action
	registerDrawer(register, event) {
		this.#debug?.(`registerDrawer::${register}: `, event?.detail);

		if (register) {
			this.#debug?.(`registerDrawer: registering with navIconControl...`);
			this.#sidebar = event?.detail?.controls;

			this.#navIconControls?.registerSidebar?.(null, this.#sidebar);
		} else {
			this.#debug?.(
				`registerDrawer: un-registering with navIconControl...`
			);

			this.#navIconControls?.unregisterSidebar?.();
			this.#sidebar = null;
		}
	}

	@action
	drawerStatusChange(event) {
		this.#debug?.(`drawerStatusChange: `, event?.detail);
	}
	// #endregion

	// #region DOM Event Handlers - Drawer / Sidebar List Items
	@action
	processListGroupEvent(event) {
		this.#debug?.('processListGroupEvent', event?.detail);
	}
	// #endregion

	// #region DOM Event Handlers - Alert / Snackbar
	@action
	snackBarInitialized(element) {
		later?.(
			this,
			() => {
				this.#debug?.('snackBarInitialized', element);
				this?.alertManager?.notify?.({
					actionLabel: 'Alert Action',
					text: 'Bohemian Rhapsody',
					timeout: 30000,

					actionHandler: this?._onAlertActioned,
					closeHandler: this?._onAlertClosed
				});
			},
			5000
		);
	}

	@action
	_onAlertActioned() {
		this.#debug?.('_onAlertActioned: ', arguments);
	}

	@action
	_onAlertClosed() {
		this.#debug?.('_onAlertClosed: ', arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('controller:application');

	#navIconControls = null;
	#sidebar = null;
	// #endregion
}
