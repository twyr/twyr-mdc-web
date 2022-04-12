import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcCheckboxComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked inputElementId = 'xyz';
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

		const rootElement = this.#element?.closest?.('div.mdc-form-field');
		if (!rootElement) return;

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		rootElement?.style?.removeProperty?.('--mdc-checkbox-ink-color');
		rootElement?.style?.removeProperty?.('--mdc-checkbox-checked-color');
		rootElement?.style?.removeProperty?.('--mdc-checkbox-unchecked-color');
		rootElement?.style?.removeProperty?.('--mdc-checkbox-ripple-color');

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Check if Step 2 is necessary
		if (!this?.args?.palette) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const checkedColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'primary'
		}`;

		rootElement?.style?.setProperty?.(
			'--mdc-checkbox-ink-color',
			`var(${checkedColour})`
		);

		rootElement?.style?.setProperty?.(
			'--mdc-checkbox-checked-color',
			`var(${paletteColour})`
		);

		rootElement?.style?.setProperty?.(
			'--mdc-checkbox-unchecked-color',
			`var(${paletteColour})`
		);

		rootElement?.style?.setProperty?.(
			'--mdc-checkbox-ripple-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this.#mdcRipple = new MDCRipple(
			this.#element?.closest?.('div.mdc-checkbox')
		);
		this.#mdcRipple.unbounded = true;

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
		this.inputElementId = this.#element?.id;

		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#element
				?.closest?.('div.mdc-checkbox')
				?.classList?.add?.('mdc-checkbox--disabled');

			return;
		}

		this.#element
			?.closest?.('div.mdc-checkbox')
			?.classList?.remove?.('mdc-checkbox--disabled');
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-checkbox');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
