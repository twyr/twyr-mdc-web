import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSwitchComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked inputElementId = 'xyz';
	@tracked selected = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#mdcRipple = null;
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);
		this.selected = !this?.selected;
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-track-color'
		);

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-handle-color'
		);

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-state-layer-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-state-layer-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-state-layer-color'
		);

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Check if Step 2 is necessary
		if (!this?.args?.palette) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-track-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-handle-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-state-layer-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(
			this.#element?.querySelector?.('div.mdc-switch__handle')
		);

		this?._setComponentState?.();
		this?.recalcStyles?.();

		if (this.#element?.hasAttribute?.('selected')) this.selected = true;
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get label() {
		const stdLabel = this?.args?.label ?? 'Switch';

		let statusLabel = null;
		if (this.selected) {
			statusLabel = this?.args?.selectedLabel ?? null;
		} else {
			statusLabel = this?.args?.unselectedLabel ?? null;
		}

		return statusLabel ?? stdLabel;
	}
	// #endregion

	// #region Private Methods
	_setComponentState() {
		this.inputElementId = this.#element?.id;

		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
		} else {
			// this.#mdcRipple?.activate?.();
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-switch');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
