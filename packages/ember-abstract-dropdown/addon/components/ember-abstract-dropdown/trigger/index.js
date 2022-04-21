import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcAbstractDropdownTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked dropdownId = null;
	@tracked disabled = false;
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setDropdownStatus = this?._setDropdownStatus;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.args?.dropdownControls?.register?.('trigger', null, false);

		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onTriggerEvent(event) {
		this.#debug?.(`onTriggerEvent::${this?.triggerEvent} `, event);
		this?.args?.dropdownControls?.toggle?.(event);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.args?.dropdownControls?.register?.(
			'trigger',
			{
				element: this.#element,
				controls: this.#controls
			},
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);

		this.dropdownId = dropdownStatus?.id;
		this.disabled = dropdownStatus?.disabled;
		this.open = dropdownStatus?.open;
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
	#debug = debugLogger('component:ember-abstract-dropdown-trigger');
	#controls = {};

	#element = null;
	// #endregion
}
