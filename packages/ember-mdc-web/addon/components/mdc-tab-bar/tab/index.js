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

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._select;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?.args?.tabbarControls?.registerItem?.(this.#element, null, false);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick() {
		this?.args?.tabbarControls?.selectItem?.(this.#element, true);
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		MDCRipple?.attachTo?.(this.#element);
		this?.recalcStyles?.();

		this?.args?.tabbarControls?.registerItem?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Computed Properties
	get selectedTabIndicator() {
		return this?.args?.selectedTabIndicator ?? 'underline';
	}
	// #endregion

	// #region Private Methods
	@action
	_select(selected) {
		this.#debug?.(`_select: `, selected);
		this.selected = selected;
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-tab-bar-tab');

	#element = null;
	#controls = {};
	// #endregion
}
