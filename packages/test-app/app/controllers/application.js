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
	@tracked palette = 'primary';

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
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#listGroupItems?.clear?.();
		this.#listGroupItems = null;

		this.#listGroupControls = null;

		this.#sidebar = null;
		this.#navIconControls = null;

		super.willDestroy(...arguments);
	}
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
		this.#navIconControls?.registerSidebar?.(null, this.#sidebar);

		this?._setInitialSelectedListItem?.('storeNavigationIconControls');
	}

	@action
	registerDrawer(register, event) {
		this.#debug?.(`registerDrawer::${register}: `, event?.detail);

		if (register) {
			this.#sidebar = event?.detail?.controls;

			if (!this.#navIconControls) {
				this.#debug?.(
					`registerDrawer: no navIconControl yet. nothing to do...`
				);
				return;
			}

			this.#debug?.(`registerDrawer: registering with navIconControl...`);
			this.#navIconControls?.registerSidebar?.(null, this.#sidebar);

			this?._setInitialSelectedListItem?.('registerDrawer');
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
	setLinkRouteMap(element, { route }) {
		this.#debug?.(`setSelectedLink::route::${route}: `, element);
		this.#listGroupItems?.set?.(element, route);
	}

	@action
	processListGroupEvent(event) {
		this.#debug?.('processListGroupEvent', event?.detail);
		if (!this.#listGroupControls) return;

		const listItemId =
			event?.detail?.status?.selected ??
			event?.detail?.status?.unselected;
		const listItem = document.getElementById(listItemId);
		if (!listItem) return;

		const route = this.#listGroupItems?.get?.(listItem);

		this.#debug?.(`processListGroupEvent::route::${route}: `, listItem);
		this?.emberRouter?.transitionTo?.(route);

		later?.(
			this,
			() => {
				this.#listGroupControls?.selectItem?.(listItem, true);
			},
			100
		);
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
	_setInitialSelectedListItem(source) {
		const currentRouteName = this?.emberRouter?.currentRouteName;
		this.#debug?.(
			`_setInitialSelectedListItem::${source}: `,
			currentRouteName
		);

		let activeListItem = null;
		this.#listGroupItems?.forEach?.((route, listItem) => {
			if (route !== currentRouteName) return;
			activeListItem = listItem;
		});

		this.#listGroupControls?.selectItem?.(activeListItem, true);
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('controller:application');

	#navIconControls = null;
	#sidebar = null;

	#listGroupControls = null;
	#listGroupItems = new Map();
	// #endregion
}
