import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';
import { MDCLineRipple } from '@material/line-ripple';

export default class MdcTextFieldComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked inputElementId = 'xyz';

	@tracked characterCount = 0;
	@tracked numCharacters = 0;

	@tracked isFocused = false;
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

		this.#mdcLineRipple = null;
		this.#mdcRipple = null;
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onInput(event) {
		this.#debug?.(`onInput: `, event);
		this.numCharacters = this.#element?.value?.length;
	}

	@action
	setFocus(focused) {
		this.#debug?.(`setFocus: `, focused);
		this.isFocused = focused;
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setupInitState?.();
		this?.recalcStyles?.();

		this?.setupLineRipple?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		const rootElement = this.#element?.closest?.(
			'div.text-field-container'
		);
		if (!rootElement) return;

		// Step 1: Reset
		rootElement?.style?.removeProperty?.('--mdc-text-field-color');

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		rootElement?.style?.setProperty?.(
			'--mdc-text-field-color',
			`var(${paletteColour})`
		);
	}

	@action
	setupLineRipple() {
		this.#mdcLineRipple = null;
		if (this?.args?.outlined) return;

		const lineRippleElement = this.#element
			?.closest?.('label.mdc-text-field')
			?.querySelector?.('span.mdc-line-ripple');

		if (!lineRippleElement) return;

		this.#mdcLineRipple = new MDCLineRipple(lineRippleElement);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(
			this.#element?.closest?.('label.mdc-text-field')
		);

		this?._setupInitState?.();
		this?.recalcStyles?.();

		this?.setupLineRipple?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setupInitState() {
		this.inputElementId = this.#element?.id;

		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#mdcLineRipple?.deactivate?.();

			this.#element
				?.closest?.('label.mdc-text-field')
				?.classList?.add?.('mdc-text-field--disabled');
		} else {
			this.#element
				?.closest?.('label.mdc-text-field')
				?.classList?.remove?.('mdc-text-field--disabled');

			// this.#mdcLineRipple?.activate?.();
			// this.#mdcRipple?.activate?.();
		}

		this.characterCount = 0;
		if (this.#element?.hasAttribute?.('maxlength')) {
			this.characterCount = Number(
				this.#element?.getAttribute?.('maxlength')
			);
			if (Number?.isNaN?.(this.characterCount)) this.characterCount = 0;
		}

		if (this.#element?.hasAttribute?.('required'))
			this.#element
				?.closest?.('label.mdc-text-field')
				?.querySelector?.('span.mdc-floating-label')
				?.classList?.add?.('mdc-floating-label--required');
		else
			this.#element
				?.closest?.('label.mdc-text-field')
				?.querySelector?.('span.mdc-floating-label')
				?.classList?.remove?.('mdc-floating-label--required');

		this.numCharacters = this.#element?.value?.length;
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-text-field');

	#element = null;
	#mdcRipple = null;
	#mdcLineRipple = null;
	// #endregion
}
