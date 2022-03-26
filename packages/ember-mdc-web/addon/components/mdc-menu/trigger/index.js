import Component from '../../mdc-abstract-dropdown/trigger/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcMenuTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.openItem = this?._openItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this?.args?.itemControls?.setControls?.('trigger', this.#controls);
	}
	// #endregion

	// #region Controls
	@action
	_openItem(open) {
		this.#debug?.(`_openItem: `, open);
		if (open) {
			this?.args?.dropdownControls?.open?.();
			return;
		}

		this?.args?.dropdownControls?.close?.();
	}
	// #endregion

	// #region Computed Properties
	get iconComponent() {
		return this?._getComputedSubcomponent?.('icon');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		icon: 'mdc-list/item/icon'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-trigger');
	#controls = {};
	// #endregion
}
