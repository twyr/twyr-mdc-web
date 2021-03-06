import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { MDCRipple } from '@material/ripple/index';

export default class MdcFabComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
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

		const iconElement = this.#element?.querySelector?.('i.mdc-fab__icon');
		const labelElement = this.#element?.querySelector?.(
			'span.mdc-fab__label'
		);

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		this.#element?.style?.removeProperty?.('--mdc-fab-ripple-color');
		this.#element.style.backgroundColor = null;
		this.#element.style.color = null;

		if (iconElement) iconElement.style.color = null;
		if (labelElement) labelElement.style.color = null;

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Check if Step 2 is necessary
		if (!this?.args?.palette) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${
			this?.args?.palette ?? 'secondary'
		}`;
		const textColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'secondary'
		}`;

		this.#element.style.backgroundColor = `var(${paletteColour})`;
		this.#element.style.color = `var(${textColour})`;

		if (iconElement) iconElement.style.color = `var(${textColour})`;
		if (labelElement) labelElement.style.color = `var(${textColour})`;

		this.#element?.style?.setProperty?.(
			'--mdc-fab-ripple-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setComponentState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			return;
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-fab');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
