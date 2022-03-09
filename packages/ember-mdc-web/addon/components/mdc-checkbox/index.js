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

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setState = this?._setState;
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation:`, arguments);
		if (!this.#element) return;

		if (mutationRecord?.attributeName === 'id') {
			this.inputElementId = this.#element?.getAttribute?.('id');
			return;
		}

		if (mutationRecord?.attributeName === 'disabled') {
			if (this.#element?.disabled)
				this.#element
					?.closest?.('div.mdc-checkbox')
					?.classList?.add?.('mdc-checkbox--disabled');
			else
				this.#element
					?.closest?.('div.mdc-checkbox')
					?.classList?.remove?.('mdc-checkbox--disabled');
		}

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

		rootElement?.style?.removeProperty?.('--mdc-checkbox-ink-color');
		rootElement?.style?.removeProperty?.('--mdc-checkbox-checked-color');
		rootElement?.style?.removeProperty?.('--mdc-checkbox-ripple-color');

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
			'--mdc-checkbox-ripple-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();

		const checkboxRipple = new MDCRipple(
			this.#element?.closest?.('div.mdc-checkbox')
		);
		checkboxRipple.unbounded = true;

		this.inputElementId = this.#element?.getAttribute?.('id');
		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	@action
	_fireEvent(name) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					checked: this.#element?.checked,
					indeterminate: this.#element?.indeterminate,
					disabled: this.#element?.disabled
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	_setState(status) {
		this.#debug?.(`_setState:`, status);

		let shouldFireEvent = false;

		if (
			status?.indeterminate !== null &&
			status?.indeterminate !== undefined &&
			this.#element.indeterminate !== status?.indeterminate
		) {
			this.#element.indeterminate = status?.indeterminate;
			shouldFireEvent ||= true;
		}

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
	#debug = debugLogger('component:mdc-checkbox');
	#element = null;

	#controls = {};
	// #endregion
}
