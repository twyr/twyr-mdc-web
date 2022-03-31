import Component from '../../mdc-icon-button/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcDrawerControlComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.registerSidebar = this?._register;
		this.#controls.unregisterSidebar = this?._unregister;
		this.#controls.setState = this?._setSidebarState;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#sideBar = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.('onClick: ', event);
		this.#sideBar?.toggle?.();
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Controls
	@action
	_register(sidebarElement, sidebarControls) {
		this.#debug?.(`_register: `, sidebarElement);

		this.#sideBar = sidebarControls;
		sidebarControls?.setControlElement?.({
			element: this.#element,
			controls: this.#controls
		});
	}

	@action
	_unregister(sidebarElement) {
		this.#debug?.(`_unregister: `, sidebarElement);
		this.#sideBar = null;
	}

	@action
	_setSidebarState(status) {
		this.#debug?.(`_setSidebarState: `, status);
		this.open = status;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_fireEvent(name) {
		this.#debug?.(`_fireEvent: ${name}`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				controls: this.#controls
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-drawer-control');
	#controls = {};

	#element = null;
	#sideBar = null;
	// #endregion
}
