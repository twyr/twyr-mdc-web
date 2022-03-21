import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcMenuItemComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked disabled = false;
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.open = this?._openItem;
		this.controls.status = this?._getStatus;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);
		this?.args?.menuControls?.registerItem?.(this.#element, null, false);

		this.controls = {};
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug(`onClick: `, event);
		this?.args?.menuControls?.openItem?.(this.#element, !this?.open);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this.disabled = this.#element?.disabled;
		this?.args?.menuControls?.registerItem?.(
			this.#element,
			this.controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_openItem(open) {
		this.#debug(`_openItem: ${open}`);
		this.open = open;
	}

	@action
	_getStatus() {
		this.#debug(`_getStatus`);
		return {
			open: this.open,
			disabled: this.disabled
		};
	}
	// #endregion

	// #region Computed Properties
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
		itemList: 'twyr-menu/item/list',
		itemTrigger: 'twyr-menu/item/trigger'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-item');
	#element = null;
	// #endregion
}
