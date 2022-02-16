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
		this.#element?.style?.removeProperty?.(
			'--mdc-text-button-container-shape'
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
		this.#element?.style?.removeProperty?.(
			'--mdc-outlined-button-container-shape'
		);

		// Raised (protected) button
		this.#element?.style?.removeProperty?.(
			'--mdc-protected-button-label-text-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-protected-button-container-color'
		);

		// Filled (Un-elevated) button
		this.#element?.style?.removeProperty?.(
			'--mdc-filled-button-label-text-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-filled-button-container-color'
		);

		// Step 2: Style / Palette for each button type
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;
		const borderRadius = window?.getComputedStyle?.(
			this.#element
		)?.borderRadius;

		// Non-styled (regular) button
		this.#element?.style?.setProperty?.(
			'--mdc-text-button-label-text-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-text-button-hover-state-layer-color',
			`var(${paletteColour})`
		);

		if (this?.args?.shape === 'rounded')
			this.#element?.style?.setProperty?.(
				'--mdc-text-button-container-shape',
				borderRadius
			);

		// Outlined button
		if (this?.args?.style === 'outlined') {
			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-outline-color',
				`var(${paletteColour})`
			);

			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-label-text-color',
				`var(${paletteColour})`
			);

			this.#element?.style?.setProperty?.(
				'--mdc-outlined-button-hover-state-layer-color',
				`var(${paletteColour})`
			);

			if (this?.args?.shape === 'rounded')
				this.#element?.style?.setProperty?.(
					'--mdc-outlined-button-container-shape',
					borderRadius
				);
		}

		// Raised button
		if (this?.args?.style === 'raised') {
			this.#element?.style?.setProperty?.(
				'--mdc-protected-button-label-text-color',
				`var(${textColour})`
			);
			this.#element?.style?.setProperty?.(
				'--mdc-protected-button-container-color',
				`var(${paletteColour})`
			);
		}

		// Flat button
		if (this?.args?.style === 'flat') {
			this.#element?.style?.setProperty?.(
				'--mdc-filled-button-label-text-color',
				`var(${textColour})`
			);
			this.#element?.style?.setProperty?.(
				'--mdc-filled-button-container-color',
				`var(${paletteColour})`
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
