import Component from '../../../mdc-abstract-dropdown/trigger/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcMenuItemTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.openItem = this?._openItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	onTriggerEvent(event) {
		this.#debug?.(`onTriggerEvent::${this?.triggerEvent} `, event);
		this?.args?.itemControls?.onTriggerEvent?.(true, event);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this?.args?.itemControls?.setControls?.(this.#controls);
	}
	// #endregion

	// #region Controls
	@action
	_openItem(open) {
		this.#debug?.(`_openItem: `, open);
		if (open) {
			this?.args?.dropdownControls?.open?.();
			return;
		}

		this?.args?.dropdownControls?.close?.();
	}
	// #endregion

	// #region Computed Properties
	get triggerEvent() {
		return this?.args?.triggerEvent ?? 'mouseup';
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-item-trigger');
	#controls = {};
	// #endregion
}
