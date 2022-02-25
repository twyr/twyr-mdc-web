import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcListComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.registerItem = this?._registerItem;
		this.controls.selectItem = this?._selectItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#items?.clear?.();
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;
	}
	// #endregion

	// #region Computed Properties
	get dividerComponent() {
		return this?._getComputedSubcomponent?.('divider');
	}

	get listItemComponent() {
		return this?._getComputedSubcomponent?.('listItem');
	}
	// #endregion

	// #region Private Methods
	@action
	_registerItem(item, controls, register) {
		this.#debug?.(`_registerItem: `, item, controls, register);

		if (this?.args?.listGroupControls) {
			this?.args?.listGroupControls?.registerItem?.(
				item,
				controls,
				register
			);
			return;
		}

		if (!register) {
			this.#items?.delete?.(item);
			return;
		}

		this.#items?.set?.(item, controls);
	}

	@action
	_selectItem(item, selected) {
		this.#debug?.(`_selectItem: `, item);

		if (this?.args?.listGroupControls) {
			this?.args?.listGroupControls?.selectItem?.(item, selected);
			return;
		}

		if (!this.#items?.has?.(item)) {
			this.#debug?.(`Item not registered: `, item);
		}

		this.#items?.forEach?.((itemControls, mappedItem) => {
			if (mappedItem === item) return;
			itemControls?.select?.(false);
		});

		const listItemControls = this.#items?.get?.(item);
		if (!listItemControls) {
			this.#debug?.(`Controls not found for: `, item);
			return;
		}

		listItemControls?.select?.(selected);
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(`${componentName}-component`, subComponent);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		divider: 'mdc-list/divider',
		listItem: 'mdc-list/item'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list');

	#element = null;
	#items = new Map();
	// #endregion
}
