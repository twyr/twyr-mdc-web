import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcListDividerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	recalcStyle() {
		if (!this.#element) return;

		this.#element.style.backgroundColor = null;

		if (!this?.args?.palette) return;

		this.#element.style.backgroundColor = `var(--mdc-theme-${this?.args?.palette})`;
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyle?.();
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list-divider');
	#element = null;
	// #endregion
}
