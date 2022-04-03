import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	@service('emberFreestyle') documentationManager;
	@service('router') emberRouter;
	@service('snackbarManager') alertManager;
	// #endregion

	// #region Tracked Attributes
	@tracked palette = 'error';

	@tracked drawerLocked = true;
	@tracked drawerModal = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.documentationManager.allowRenderingAllSections = false;
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
	setListGroupControls(event) {
		this.#debug?.('setListGroupControls', event?.detail);
		this.#listGroupControls = event?.detail?.controls;
	}

	@action
	setSelectedLink(route, event) {
		this.#debug?.(`setSelectedLink::route::${route}: `, event?.target);
		if (!this.#listGroupControls) return;

		let listItem = event?.target;
		if (!listItem?.classList?.contains?.('mdc-list-item'))
			listItem = listItem?.closest?.('mdc-list-item');

		this.#listGroupControls?.selectItem?.(listItem, true);
		this?.emberRouter?.transitionTo?.(route);
	}

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
					actionLabel: 'Alert',
					text: 'To alert, or not to alert: that is the question',
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

	#listGroupControls = null;
	// #endregion
}
