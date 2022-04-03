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

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._setSelected;
		this.#controls.buttonReady = this?._onButtonReady;
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

		this.#mdcRipple = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);
		this?.args?.segmentedButtonControls?.select?.(
			this.#element,
			!this.#selected
		);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setComponentState?.();
		this?.recalcAria?.();
		this?.recalcStyles?.();
	}

	@action
	recalcAria() {
		this.#debug?.(`recalcAria: re-calculating aria`);

		this.checked = this?.args?.singleSelect
			? this.#selected ?? false
			: null;
		this.pressed = this?.args?.singleSelect
			? null
			: this.#selected ?? false;
	}

	@action
	recalcStyles() {
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

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

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
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcAria?.();
		this?.recalcStyles?.();

		this?.args?.segmentedButtonControls?.register?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_onButtonReady() {
		this.#debug?.(`_onButtonReady`);
		if (!this.#element?.hasAttribute?.('selected')) return;

		this?.args?.segmentedButtonControls?.select?.(
			this.#element,
			!this.#selected
		);
	}

	@action
	_setSelected(selected) {
		this.#debug?.(`_setSelected: `, selected);
		this.#selected = selected;

		this?.recalcAria?.();
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
	_setComponentState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#element?.classList?.add?.(
				'mdc-segmented-button__segment--disabled'
			);

			return;
		}

		// this.#mdcRipple?.activate?.();
		this.#element?.classList?.remove?.(
			'mdc-segmented-button__segment--disabled'
		);
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-segmented-button-segment');
	#controls = {};

	#element = null;
	#mdcRipple = null;

	#selected = false;
	// #endregion
}
