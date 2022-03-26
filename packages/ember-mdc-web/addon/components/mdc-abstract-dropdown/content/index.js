import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcAbstractDropdownContentComponent extends Component {
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

		this.#controls.setDropdownStatus = this?._setDropdownStatus;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.args?.dropdownControls?.register?.('content', null, false);

		this.#controls = {};
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	async setNewPosition() {
		this.#debug?.(`setNewPosition`);
		if (!this.#element) {
			this.#debug?.(`setNewPosition::element: null. Aborting.`);
			return;
		}

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
		this.#debug?.(`setNewPosition::position: `, position);

		const currentCSS = this.#element?.style;
		currentCSS['left'] = `${
			position?.dropdownRect?.['left'] +
			window?.scrollX +
			position?.['left']
		}px`;
		currentCSS['top'] = `${
			position?.dropdownRect?.['top'] +
			window?.scrollY +
			position?.['top']
		}px`;
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;
	}

	@action
	async storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.args?.dropdownControls?.register?.(
			'content',
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
	async _setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);

		this.dropdownId = dropdownStatus?.id;
		this.disabled = dropdownStatus?.disabled;

		if (!dropdownStatus?.open) return;

		await this?.setNewPosition();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	get contentId() {
		return `${this?.dropdownId}-content`;
	}

	get contentContainerElement() {
		return document?.querySelector?.(
			'div#mdc-abstract-dropdown--content-container'
		);
	}

	get matchTriggerWidth() {
		return this?.args?.matchTriggerWidth ?? false;
	}

	get xAlign() {
		return this?.args?.xAlign ?? 'left';
	}

	get xOffset() {
		let xOffset = Number(this?.args?.xOffset);
		if (Number?.isNaN?.(xOffset)) xOffset = 0;

		return xOffset;
	}

	get yAlign() {
		return this?.args?.yAlign ?? 'bottom';
	}

	get yOffset() {
		let yOffset = Number(this?.args?.yOffset);
		if (Number?.isNaN?.(yOffset)) yOffset = 0;

		return yOffset;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown-content');

	#element = null;
	#controls = {};
	// #endregion
}
