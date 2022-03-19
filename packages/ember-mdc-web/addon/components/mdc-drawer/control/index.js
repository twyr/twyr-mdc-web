import Component from '../../mdc-icon-button/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcDrawerControlComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked toggled = false;
	// #endregion

	// #region Untracked Public Fields
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
		this.#controls = {};

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);

		this.#sideBars?.forEach?.((value) => {
			const sidebarControls = value;
			this.toggled ||= sidebarControls?.toggle?.();
		});
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
		this.#sideBars?.set(sidebarElement, sidebarControls);

		sidebarControls?.setControlElement?.(this.#element);
	}

	@action
	_unregister(sidebarElement) {
		this.#debug?.(`_unregister: `, sidebarElement);
		this.#sideBars?.delete?.(sidebarElement);
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
				id: this.#element?.getAttribute?.('id'),
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
	#element = null;

	#controls = {};
	#sideBars = new Map();
	// #endregion
}
