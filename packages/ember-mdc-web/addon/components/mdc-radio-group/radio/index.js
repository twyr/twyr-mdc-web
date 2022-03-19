import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcRadioGroupRadioComponent extends Component {
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

		this?._setupInitState?.();
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

		rootElement?.style?.removeProperty?.('--mdc-radio-ink-color');
		rootElement?.style?.removeProperty?.('--mdc-radio-checked-color');
		rootElement?.style?.removeProperty?.('--mdc-radio-ripple-color');

		// Stop if the element is disabled
		if (this.#element?.disabled) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const checkedColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'primary'
		}`;

		rootElement?.style?.setProperty?.(
			'--mdc-radio-ink-color',
			`var(${checkedColour})`
		);

		rootElement?.style?.setProperty?.(
			'--mdc-radio-checked-color',
			`var(${paletteColour})`
		);

		rootElement?.style?.setProperty?.(
			'--mdc-radio-ripple-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this.#mdcRipple = new MDCRipple(
			this.#element?.closest?.('div.mdc-radio')
		);
		this.#mdcRipple.unbounded = true;

		this?._setupInitState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setupInitState() {
		this.inputElementId = this.#element?.getAttribute?.('id');

		if (this.#element?.disabled) {
			this.#mdcRipple?.deactivate?.();
			this.#element
				?.closest?.('div.mdc-radio')
				?.classList?.add?.('mdc-radio--disabled');
		} else {
			this.#element
				?.closest?.('div.mdc-radio')
				?.classList?.remove?.('mdc-radio--disabled');

			this.#mdcRipple?.activate?.();
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-radio-group-radio');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
