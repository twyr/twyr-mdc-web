import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	@service('alertManager') alertManager;
	// #endregion

	// #region Tracked Attributes
	@tracked palette = 'secondary';

	@tracked bufferValue = 59;
	@tracked progress = 59;
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
	storeNavigationIconControls(event) {
		this.#debug?.('storeNavigationIconControls: ', event?.detail);
		this.#navIconControls = event?.detail?.controls;

		if (!this.#toBeRegisteredDrawers?.length) {
			this.#debug?.(
				'storeNavigationIconControls: no deferred sidebars. nothing to do...'
			);
			return;
		}

		this.#debug?.(
			'storeNavigationIconControls: registering deferred sidebars...'
		);
		this.#toBeRegisteredDrawers?.forEach?.(({ drawer, operation }) => {
			const drawerElement = document?.getElementById?.(drawer?.id);
			if (!drawerElement) {
				this.#debug?.(
					'storeNavigationIconControls::sidebar element not found: ',
					drawer?.id
				);
				return;
			}

			this.#debug?.(`registerDrawer: registering with navIconcontrol...`);
			if (operation) {
				this.#navIconControls?.registerSidebar?.(
					drawerElement,
					drawerElement?.controls
				);
			} else {
				this.#navIconControls?.unregisterSidebar?.(drawerElement);
			}
		});

		this.#toBeRegisteredDrawers.length = 0;
	}

	@action
	registerDrawer(register, event) {
		this.#debug?.(`registerDrawer::${register}: `, event?.detail);
		if (!this.#navIconControls) {
			this.#debug?.(
				`registerDrawer: navigation icon controls nont there yet. deferring...`
			);
			this.#toBeRegisteredDrawers?.push?.({
				drawer: event?.detail,
				operation: register
			});

			return;
		}

		const drawerElement = document?.getElementById?.(event?.detail?.id);
		if (!drawerElement) {
			this.#debug?.(
				`registerDrawer::sidebar element not found: `,
				event?.detail?.id
			);
			return;
		}

		if (register) {
			this.#debug?.(`registerDrawer: registering with navIconcontrol...`);
			this.#navIconControls?.registerSidebar?.(
				drawerElement,
				event?.detail?.controls
			);
		} else {
			this.#debug?.(
				`registerDrawer: un-registering with navIconcontrol...`
			);
			this.#navIconControls?.unregisterSidebar?.(drawerElement);
		}
	}

	@action
	drawerStatusChange(event) {
		this.#debug?.(`drawerStatusChange: `, event?.detail);
	}

	@action
	closeChip(event) {
		this.#debug?.('closeChip', event?.detail);
	}

	@action
	processCheckboxEvent(event) {
		this.#debug?.('processCheckboxEvent', event?.detail);

		// setTimeout(() => {
		// 	const newStatus = Object?.assign?.({}, event?.detail?.status);
		// 	const checkboxControls = event?.detail?.controls;

		// 	newStatus.checked = !newStatus.checked;
		// 	checkboxControls?.setState?.(newStatus);
		// }, 2000);
	}

	@action
	processRadioGroupEvent(event) {
		this.#debug?.('processRadioGroupEvent', event?.detail);

		// setTimeout(() => {
		// 	const newStatus = Object?.assign?.({}, event?.detail?.status);
		// 	delete newStatus.radio;

		// 	const radio = document?.getElementById?.(
		// 		event?.detail?.status?.radio
		// 	);
		// 	const radioGroupControls = event?.detail?.controls;

		// 	newStatus.checked = !newStatus.checked;
		// 	radioGroupControls?.selectRadio?.(radio, newStatus);
		// }, 3000);
	}

	@action
	processListGroupEvent(event) {
		this.#debug?.('processListGroupEvent', event?.detail);
		// if(!event?.detail?.status?.unselected) return;

		// setTimeout(() => {
		// 	const unselectedItem = document?.getElementById?.(event?.detail?.status?.unselected);
		// 	event?.detail?.controls?.selectItem?.(unselectedItem, true);
		// }, 5000);
	}

	@action
	onButtonGroupSelectionChange(event) {
		this.#debug?.('onButtonGroupSelectionChange', event?.detail);
		// if(!event?.detail?.status?.unselected) return;

		// setTimeout(() => {
		// 	const unselectedSegment = document?.getElementById?.(event?.detail?.status?.unselected);
		// 	event?.detail?.controls?.selectSegment?.(unselectedSegment);
		// }, 3000);
	}

	@action
	processSwitchEvent(event) {
		this.#debug?.('processSwitchEvent', event?.detail);
		// setTimeout(() => {
		// 	const newStatus = Object?.assign({}, event?.detail?.status);
		// 	newStatus.on = !newStatus?.on;
		// 	event?.detail?.controls?.setState?.(newStatus);
		// }, 3000);
	}

	@action
	setAlertControls(event) {
		this.#debug?.('setAlertControls: ', event?.detail);
		this.#alertControls = event?.detail?.controls;

		setTimeout(() => {
			this.#debug?.('setAlertControls: showing alert...');
			this.#numAlertDisplay++;

			// this.#alertControls?.showAlert?.({
			// 	open: true,
			// 	text: `Wassup #${this.#numAlertDisplay}?`,
			// 	actionLabel: 'Close'
			// });

			this?.alertManager?.notify?.({
				id: event?.detail?.id,
				open: true,
				text: `Wassup #${this.#numAlertDisplay}?`,
				actionLabel: 'Close'
			});
		}, 1000);
	}

	@action
	processAlertDisplay(event) {
		this.#debug?.('processAlertDisplay: ', event?.detail);
		if (event?.detail?.status?.open) return;

		setTimeout(() => {
			this.#debug?.('setAlertControls: showing alert...');

			for (let idx = 0; idx < 5; idx++) {
				this.#numAlertDisplay++;

				// this.#alertControls?.showAlert?.({
				// 	open: true,
				// text: `Wassup #${this.#numAlertDisplay}?`,
				// 	actionLabel: 'Close'
				// });

				this?.alertManager?.notify?.({
					id: event?.detail?.id,
					open: true,
					text: `Wassup #${this.#numAlertDisplay}?`,
					actionLabel: 'Close'
				});
			}
		}, 10000);
	}

	@action
	processAlertAction(event) {
		this.#debug?.('processAlertAction', event?.detail);

		setTimeout(() => {
			this.#numAlertDisplay++;

			this.#alertControls?.showAlert?.({
				open: true,
				text: `Wassup #${this.#numAlertDisplay}?`,
				actionLabel: 'Close'
			});
		}, 10000);
	}

	@action
	processAlertClose(event) {
		this.#debug?.('processAlertClose', event?.detail);
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
	#numAlertDisplay = 0;

	#alertControls = null;
	#navIconControls = null;

	#toBeRegisteredDrawers = [];
	// #endregion
}
