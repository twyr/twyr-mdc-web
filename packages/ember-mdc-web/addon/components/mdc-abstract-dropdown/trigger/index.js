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
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setDropdownstatus = this?._setDropdownStatus;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.controls = {};
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onMouseEnter(event) {
		this.#debug?.(`onMouseEnter: `, event);
		if (this?.reactEvent !== 'hover' && this?.reactEvent !== 'mouseenter')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	onMouseLeave(event) {
		this.#debug?.(`onMouseLeave: `, event);
		if (this?.reactEvent !== 'hover' && this?.reactEvent !== 'mouseleave')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	onMouseDown(event) {
		this.#debug?.(`onMouseDown: `, event);
		if (this?.reactEvent !== 'mousedown') return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	onMouseUp(event) {
		this.#debug?.(`onMouseUp: `, event);
		if (this?.reactEvent !== 'mouseup' && this?.reactEvent !== 'click')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
		this?.args?.dropdownControls?.register?.('trigger', {
			element: this.#element,
			controls: this.#controls
		});
	}
	// #endregion

	// #region Controls
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);

		this.dropdownId = dropdownStatus?.id;
		this.disabled = dropdownStatus?.disabled;

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	get reactEvent() {
		return this?.args?.reactEvent ?? 'mouseup';
	}

	get stopPropagation() {
		return this?.args?.stopPropagation ?? false;
	}

	get triggerId() {
		return `${this?.dropdownId}-trigger`;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown-trigger');

	#element = null;
	#controls = {};
	// #endregion
}
