import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcListGroupComponent extends Component {
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
	// #endregion

	// #region Computed Properties
	get headerComponent() {
		return this?._getComputedSubcomponent?.('header');
	}

	get listComponent() {
		return this?._getComputedSubcomponent?.('list');
	}
	// #endregion

	// #region Private Methods
	@action
	_registerItem(item, controls, register) {
		this.#debug?.(`_registerItem: `, item, controls, register);

		if (!register) {
			this.#items?.delete?.(item);
			return;
		}

		this.#items?.set?.(item, controls);
	}

	@action
	_selectItem(item, selected) {
		this.#debug?.(`_selectItem: `, item);

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
		header: 'mdc-list-group/header',
		list: 'mdc-list'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list-group');
	#items = new Map();
	// #endregion
}
