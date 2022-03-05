import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSegmentedButtonSegmentComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked checked = false;
	@tracked pressed = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._setSelected;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?.args?.segmentedButtonControls?.register?.(
			this.#element,
			null,
			false
		);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);
		this?.args?.segmentedButtonControls?.select?.(this.#element);
	}

	@action
	recalcAria() {
		this.#debug?.(`recalcAria: re-calculating aria`);

		this.checked = this?.args?.singleSelect ? this.#checked ?? false : null;
		this.pressed = this?.args?.singleSelect ? null : this.#pressed ?? false;
	}

	@action
	recalcStyle() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		this.#element?.style?.removeProperty?.(
			'--mdc-segmented-button-selected-container-fill-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-segmented-button-selected-ink-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-segmented-button-ripple-color'
		);

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-segmented-button-selected-container-fill-color',
			`var(${paletteColour}, rgba(1, 87, 155, 0.08))`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-segmented-button-ripple-color',
			`var(${textColour}, rgba(1, 87, 155, 0.08))`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-segmented-button-selected-ink-color',
			`var(${textColour}, #01579b)`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyle?.();
		MDCRipple?.attachTo?.(this.#element);

		this?.args?.segmentedButtonControls?.register?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Computed Properties
	get role() {
		const role = this?.args?.singleSelect ? 'radio' : null;

		this.#debug?.(`role: ${role}`);
		return role;
	}
	// #endregion

	// #region Private Methods
	@action _setSelected(selected) {
		this.#debug?.(`_setSelected: `, selected);
		this.#checked = selected;
		this.#pressed = selected;

		this?.recalcAria?.();
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-segmented-button-segment');

	#element = null;
	#controls = {};

	#checked = false;
	#pressed = false;
	// #endregion
}
