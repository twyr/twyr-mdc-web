import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcTabBarTabComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked selected = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._select;
		this.#controls.barReady = this?._onBarReady;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.args?.tabbarControls?.registerTab?.(this.#element, null, false);

		this.#mdcRipple = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);
		this?.args?.tabbarControls?.selectTab?.(this.#element, true);
	}
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
		this.#element?.style?.removeProperty?.('--mdc-active-tab-color');

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		this.#element?.style?.setProperty?.(
			'--mdc-active-tab-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcStyles?.();

		this?.args?.tabbarControls?.registerTab?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_onBarReady() {
		this.#debug?.(`_onBarReady`);

		if (!this.#element?.hasAttribute?.('selected')) return;
		this?.args?.tabbarControls?.selectTab?.(this.#element, true);
	}

	@action
	_select(selected) {
		this.#debug?.(`_select: `, selected);
		this.selected = selected;
	}
	// #endregion

	// #region Computed Properties
	get selectedTabIndicator() {
		return this?.args?.selectedTabIndicator ?? 'underline';
	}

	get indicatorLength() {
		return this?.args?.indicatorLength ?? 'full';
	}
	// #endregion

	// #region Private Methods
	_setComponentState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
		} else {
			// this.#mdcRipple?.activate?.();
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-tab-bar-tab');
	#controls = {};

	#element = null;
	#mdcRipple = null;
	// #endregion
}
