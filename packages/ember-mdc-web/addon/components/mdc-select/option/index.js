import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { cancel, scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSelectOptionComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked disabled = false;
	@tracked selected = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._select;
		this.#controls.listReady = this?._onListReady;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		if (this.#initValueSetSchedule) {
			cancel?.(this.#initValueSetSchedule);
			this.#initValueSetSchedule = null;
		}

		this?.args?.selectControls?.registerOption?.(
			this.#element,
			null,
			false
		);
		this.#controls = {};

		this.#mdcRipple = null;
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);

		this.#initValueSetSchedule = null;
		this?.args?.selectControls?.selectOption?.(
			this.#element?.getAttribute?.('value'),
			this.#element?.innerText?.trim?.()
		);
	}
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
		this.#debug?.(`recalcStyles`);
		if (!this.#element) return;

		const textElement = this.#element?.querySelector?.(
			'span.mdc-list-item__text'
		);

		const primaryTextElement = this.#element?.querySelector?.(
			'span.mdc-list-item__primary-text'
		);

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario
		this.#element?.style?.removeProperty?.('--mdc-ripple-color');

		this.#element.style.borderRadius = null;
		if (textElement) textElement.style.color = null;
		if (primaryTextElement) primaryTextElement.style.color = null;

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
		if (this?.args?.palette) {
			this.#element?.style?.setProperty?.(
				'--mdc-ripple-color',
				`var(--mdc-theme-${this?.args?.palette})`
			);

			if (textElement)
				textElement.style.color = `var(--mdc-theme-${this?.args?.palette})`;

			if (primaryTextElement)
				primaryTextElement.style.color = `var(--mdc-theme-${this?.args?.palette})`;
		}
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setupInitState?.();
		this?.recalcStyles?.();

		this?.args?.selectControls?.registerOption?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_onListReady() {
		this.#debug?.(`_onListReady`);

		if (!this.#element?.hasAttribute?.('selected')) return;

		if (this.#initValueSetSchedule) return;

		this.#initValueSetSchedule = scheduleOnce?.(
			'afterRender',
			this,
			this?.onClick
		);
	}

	@action
	_select(selected) {
		this.#debug?.(`_select: `, selected);
		this.selected = selected;

		if (!this?.selected) {
			this.#element?.removeAttribute?.('selected');
			return;
		}

		const selectedAttribute = document?.createAttribute?.('selected');
		selectedAttribute.value = true;

		this.#element?.setAttributeNode?.(selectedAttribute);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setupInitState() {
		this.#debug?.(
			`__setupInitState::disabled: ${this.#element?.hasAttribute?.(
				'disabled'
			)}`
		);
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.disabled = true;
		} else {
			// this.#mdcRipple?.activate?.();
			this.disabled = false;
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-option');

	#element = null;
	#mdcRipple = null;

	#controls = {};

	#initValueSetSchedule = null;
	// #endregion
}
