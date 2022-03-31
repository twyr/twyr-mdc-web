import Component from '../../mdc-abstract-dropdown/trigger/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';
import { MDCLineRipple } from '@material/line-ripple';

export default class MdcSelectTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked required = false;
	@tracked value = null;
	@tracked text = null;
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
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?.setupLineRipple?.();

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		const rootElement = this.#element?.closest?.('div.select-container');

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario
		rootElement?.style?.removeProperty?.('--mdc-select-field-color');

		// Stop if the element is disabled
		if (
			this.#element
				?.closest?.('div.mdc-select')
				?.hasAttribute?.('disabled')
		)
			return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;

		rootElement?.style?.setProperty?.(
			'--mdc-select-field-color',
			`var(${paletteColour})`
		);
	}

	@action
	setupLineRipple() {
		this.#debug?.(`setupLineRipple`);
		this.#mdcLineRipple = null;

		if (this?.args?.outlined) return;

		const lineRippleElement = this.#element?.querySelector?.(
			'span.mdc-line-ripple'
		);

		if (!lineRippleElement) return;

		this.#mdcLineRipple = new MDCLineRipple(lineRippleElement);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);
		this?.setupLineRipple?.();

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	@action
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);
		super._setDropdownStatus?.(dropdownStatus);

		this.required = dropdownStatus?.required;
		this.value = dropdownStatus?.value;
		this.text = dropdownStatus?.text;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	get triggerEvent() {
		return 'mouseup';
	}
	// #endregion

	// #region Private Methods
	_setComponentState() {
		if (!this.disabled) return;

		this.#mdcRipple?.deactivate?.();
		this.#mdcLineRipple?.deactivate?.();
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-trigger');

	#element = null;
	#mdcRipple = null;
	#mdcLineRipple = null;
	// #endregion
}
