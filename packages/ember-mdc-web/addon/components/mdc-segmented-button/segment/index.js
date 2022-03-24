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
		this.#controls = {};

		this.#mdcRipple = null;
		this.#element = null;

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

		this?._setupInitState?.();
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

		this?._setupInitState?.();
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
	_setupInitState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#element?.classList?.add?.(
				'mdc-segmented-button__segment--disabled'
			);
		} else {
			// this.#mdcRipple?.activate?.();
			this.#element?.classList?.remove?.(
				'mdc-segmented-button__segment--disabled'
			);
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-segmented-button-segment');

	#element = null;
	#mdcRipple = null;

	#controls = {};

	#selected = false;
	// #endregion
}
