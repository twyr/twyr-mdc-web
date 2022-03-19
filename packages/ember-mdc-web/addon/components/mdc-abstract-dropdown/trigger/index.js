import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

const KEYCODE = {
	ENTER: 13,
	ESCAPE: 27,
	SPACE: 32,

	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,

	TAB: 9
};

export default class MdcAbstractDropdownTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	handleKeyDown(event) {
		this.#debug(`handleKeyDown: `, event);

		if (
			event?.keyCode !== KEYCODE.ENTER &&
			event?.keyCode !== KEYCODE.SPACE &&
			event?.keyCode !== KEYCODE.ESCAPE
		)
			return;

		if (event?.keyCode === KEYCODE.SPACE) event?.preventDefault?.();

		if (
			event?.keyCode === KEYCODE.ENTER ||
			event?.keyCode === KEYCODE.SPACE
		)
			this?.args?.dropdownControls?.toggle?.(event);

		if (event?.keyCode === KEYCODE.ESCAPE)
			this?.args?.dropdownControls?.close?.(event);
	}

	@action
	handleMouseEnter(event) {
		this.#debug(`handleMouseEnter: `, event);
		if (this?.reactEvent !== 'hover' && this?.reactEvent !== 'mouseenter')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	handleMouseLeave(event) {
		this.#debug(`handleMouseLeave: `, event);
		if (this?.reactEvent !== 'hover' && this?.reactEvent !== 'mouseleave')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	handleMouseDown(event) {
		this.#debug(`handleMouseDown: `, event);
		if (this?.reactEvent !== 'mousedown') return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	handleMouseUp(event) {
		this.#debug(`handleMouseUp: `, event);
		if (this?.reactEvent !== 'mouseup' && this?.reactEvent !== 'click')
			return;

		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	handleTouchEnd(event) {
		this.#debug(`handleTouchEnd: `, event);
		this?.args?.dropdownControls?.toggle?.(event);
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this?.args?.registerWithDropdown?.(this.#element);
	}
	// #endregion

	// #region Computed Properties
	get isDisabled() {
		return this?.args?.dropdownStatus?.disabled ?? false;
	}

	get reactEvent() {
		return this?.args?.reactEvent ?? 'mouseup';
	}

	get stopPropagation() {
		return this?.args?.stopPropagation ?? false;
	}

	get triggerId() {
		return [this?.args?.dropdownStatus?.id, 'trigger'].join('-');
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown-trigger');
	#element = null;
	// #endregion
}
