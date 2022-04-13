import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { MDCRipple } from '@material/ripple/index';

export default class MdcIconButtonComponent extends Component {
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

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario
		this.#element.style.color = null;
		this.#element?.style?.removeProperty?.(
			'--mdc-icon-button-ripple-color'
		);

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Check if Step 2 is necessary
		if (!this?.args?.palette) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-${
			this?.args?.textColour ?? this?.args?.palette ?? 'primary'
		}`;

		this.#element.style.color = `var(${textColour})`;
		this.#element?.style?.setProperty?.(
			'--mdc-icon-button-ripple-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);
		this.#mdcRipple.unbounded = true;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get toggledIcon() {
		return this?.args?.toggledIcon ?? this?.args?.icon;
	}
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
	#debug = debugLogger?.('component:mdc-icon-button');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
