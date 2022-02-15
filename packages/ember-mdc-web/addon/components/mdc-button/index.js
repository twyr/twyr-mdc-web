import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { MDCRipple } from '@material/ripple/index';

export default class MdcButtonComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	recalcStyling() {
		this.#debug?.(`recalcStyling: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		// Non-styled (regular) button
		this.#element?.style?.removeProperty?.(
			'--mdc-text-button-label-text-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-text-button-hover-state-layer-color'
		);

		// Outlined button
		this.#element?.style?.removeProperty?.(
			'--mdc-outlined-button-outline-color'
		);

		this.#element?.style?.removeProperty?.(
			'--mdc-outlined-button-label-text-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-outlined-button-hover-state-layer-color'
		);

		// Step 2: Style for each type of button
		const paletteColor = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-text-button-label-text-color',
			`var(${paletteColor})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-text-button-hover-state-layer-color',
			`var(${paletteColor})`
		);

		// Outlined button
		if (this?.args?.outline) {
			this.#element?.style?.setProperty?.(
				'--mdc-text-button-label-text-color',
				`var(${paletteColor})`
			);
			this.#element?.style?.setProperty?.(
				'--mdc-text-button-hover-state-layer-color',
				`var(${paletteColor})`
			);
			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-outline-color',
				`var(${paletteColor})`
			);

			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-label-text-color',
				`var(${paletteColor})`
			);
			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-hover-state-layer-color',
				`var(${paletteColor})`
			);
		}
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyling?.();
		MDCRipple?.attachTo?.(this.#element);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-button');
	#element = null;
	// #endregion
}
