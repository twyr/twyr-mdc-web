import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcAbstractDropdownContentComponent extends Component {
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
	async setNewPosition() {
		this.#debug(`setNewPosition`);
		if (!this.#element) {
			this.#debug(`setNewPosition::element: null. Aborting.`);
			return;
		}

		this.#element?.style?.removeProperty('top');
		this.#element?.style?.removeProperty('right');
		this.#element?.style?.removeProperty('bottom');
		this.#element?.style?.removeProperty('left');
		this.#element?.style?.removeProperty('width');
		this.#element?.style?.removeProperty('height');

		const positionOptions = {
			xAlign: this?.xAlign,
			xOffset: this?.xOffset,

			yAlign: this?.yAlign,
			yOffset: this?.yOffset,

			matchTriggerWidth: this?.matchTriggerWidth
		};

		const position =
			(await this?.args?.dropdownControls?.calcContentPosition?.(
				positionOptions
			)) ?? {};
		this.#debug(`setNewPosition::position: `, position);

		const currentCSS = this.#element.style;
		Object.keys(position).forEach((positionKey) => {
			if (
				position?.[positionKey] === null ||
				position?.[positionKey] === undefined
			) {
				currentCSS?.removeProperty?.(positionKey);
				return;
			}

			currentCSS[positionKey] = `${position?.[positionKey]}px`;
		});
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this?.args?.registerWithDropdown?.(this.#element);
		this?.setNewPosition();
	}
	// #endregion

	// #region Computed Properties
	get contentId() {
		return [this?.args?.dropdownStatus?.id, 'content'].join('-');
	}

	get matchTriggerWidth() {
		return this?.args?.matchTriggerWidth ?? false;
	}

	get xAlign() {
		return this?.args?.xAlign ?? 'left';
	}

	get xOffset() {
		return Number(this?.args?.xOffset) ?? 0;
	}

	get yAlign() {
		return this?.args?.yAlign ?? 'bottom';
	}

	get yOffset() {
		return Number(this?.args?.yOffset) ?? 0;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown-content');
	#element = null;
	// #endregion
}
