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

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setState = this?._setState;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?.args?.groupControls?.registerItem?.(this.#element, null, false);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onAttributeMutation() {
		this.#debug?.(`onAttributeMutation:`, arguments);
		if (!this.#element) return;

		this.inputElementId = this.#element?.getAttribute?.('id');

		if (this.#element?.disabled)
			this.#element
				?.closest?.('div.mdc-radio')
				?.classList?.add?.('mdc-radio--disabled');
		else
			this.#element
				?.closest?.('div.mdc-radio')
				?.classList?.remove?.('mdc-radio--disabled');

		this?._fireEvent?.('statuschange');
	}

	@action
	onChange(event) {
		this.#debug?.(`onChange:`, event);
		this?._fireEvent?.('statuschange');
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
		rootElement?.style?.removeProperty?.('--mdc-form-field-color');

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

		rootElement?.style?.setProperty?.(
			'--mdc-form-field-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();

		const radioRipple = new MDCRipple(
			this.#element?.closest?.('div.mdc-radio')
		);
		radioRipple.unbounded = true;

		this.inputElementId = this.#element?.getAttribute?.('id');

		if (!this?.args?.groupControls) this?._fireEvent?.('init');
		else
			this?.args?.groupControls?.register?.(
				this.#element,
				this.#controls,
				true
			);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	@action
	_fireEvent(name) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		if (!this?.args?.groupControls) {
			const thisEvent = new CustomEvent(name, {
				detail: {
					id: this.#element?.getAttribute?.('id'),
					controls: this.#controls,
					status: {
						checked: this.#element?.checked,
						disabled: this.#element?.disabled
					}
				}
			});

			this.#element?.dispatchEvent?.(thisEvent);
			return;
		}

		this?.args?.groupControls?.selectRadio?.(this.#element, {
			checked: this.#element?.checked,
			disabled: this.#element?.disabled
		});
	}

	@action
	_setState(status) {
		this.#debug?.(`_setState:`, status);

		let shouldFireEvent = false;

		if (
			status?.checked !== null &&
			status?.checked !== undefined &&
			this.#element.checked !== status?.checked
		) {
			this.#element.checked = status?.checked;
			shouldFireEvent ||= true;
		}

		if (
			status?.disabled !== null &&
			status?.disabled !== undefined &&
			this.#element.disabled !== status?.disabled
		) {
			this.#element.disabled = status?.disabled;
			shouldFireEvent ||= true;
		}

		if (!shouldFireEvent) return;

		this?._fireEvent?.('statuschange');
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-radio-group-radio');
	#element = null;

	#controls = {};
	// #endregion
}
