import Component from '../../mdc-icon-button/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcTopAppBarNavigationIconComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.registerSidebar = this?._register;
		this.#controls.unregisterSidebar = this?._unregister;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#sideBars?.clear?.();
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);

		this.#sideBars?.forEach?.((value) => {
			const sidebarControls = value;
			sidebarControls?.toggle?.();
		});
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
		this.#element.sidebarControls = this.#controls;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	@action
	_register(sidebarElement, sidebarControls) {
		this.#debug?.(`_register: `, sidebarElement);
		this.#sideBars?.set(sidebarElement, sidebarControls);
	}

	@action
	_unregister(sidebarElement) {
		this.#debug?.(`_unregister: `, sidebarElement);
		this.#sideBars?.delete?.(sidebarElement);
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-top-app-bar-navigation-icon');
	#element = null;

	#controls = {};
	#sideBars = new Map();
	// #endregion
}
