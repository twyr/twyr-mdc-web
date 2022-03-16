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

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		if (mutationRecord?.attributeName === 'id') {
			this.inputElementId = this.#element?.getAttribute?.('id');
			return;
		}

		if (mutationRecord?.attributeName === 'disabled') {
			if (this.#element?.disabled)
				this.#element
					?.closest?.('label.mdc-text-field')
					?.classList?.add?.('mdc-text-field--disabled');
			else
				this.#element
					?.closest?.('label.mdc-text-field')
					?.classList?.remove?.('mdc-text-field--disabled');
		}

		if (mutationRecord?.attributeName === 'maxlength') {
			if (this.#element?.hasAttribute?.('maxlength')) {
				this.characterCount = Number(
					this.#element?.getAttribute?.('maxlength')
				);
				if (Number?.isNaN?.(this.characterCount))
					this.characterCount = 0;
			} else {
				this.characterCount = 0;
			}
		}

		this?._fireEvent?.('statuschange');
	}

	@action
	onInput(event) {
		this.#debug?.(`onInput: `, event);

		this.numCharacters = this.#element?.value?.length;
		this?._fireEvent?.('statuschange');
	}

	@action
	setFocus(focused) {
		this.#debug?.(`setFocus: `, focused);
		this.isFocused = focused;
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		const rootElement = this.#element?.closest?.('label.mdc-text-field');
		if (!rootElement) return;
	}

	@action
	setupLineRipple() {
		if (this?.args?.outlined) return;

		const lineRippleElement = this.#element
			?.closest?.('label.mdc-text-field')
			?.querySelector?.('span.mdc-line-ripple');

		if (!lineRippleElement) return;

		new MDCLineRipple(lineRippleElement);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();

		MDCRipple?.attachTo?.(this.#element?.closest?.('label.mdc-text-field'));
		this?.setupLineRipple?.();

		this.inputElementId = this.#element?.getAttribute?.('id');

		if (this.#element?.disabled)
			this.#element
				?.closest?.('label.mdc-text-field')
				?.classList?.add?.('mdc-text-field--disabled');
		else
			this.#element
				?.closest?.('label.mdc-text-field')
				?.classList?.remove?.('mdc-text-field--disabled');

		if (this.#element?.hasAttribute?.('maxlength')) {
			this.characterCount = Number(
				this.#element?.getAttribute?.('maxlength')
			);
			if (Number?.isNaN?.(this.characterCount)) this.characterCount = 0;
		} else {
			this.characterCount = 0;
		}

		this.numCharacters = this.#element?.value?.length;
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

		if (!this?.args?.groupControls) {
			const thisEvent = new CustomEvent(name, {
				detail: {
					id: this.#element?.getAttribute?.('id'),
					status: {
						value: this.#element?.value,
						disabled: this.#element?.disabled
					}
				}
			});

			this.#element?.dispatchEvent?.(thisEvent);
			return;
		}
	}

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-text-field');
	#element = null;
	// #endregion
}
