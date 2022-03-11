import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcTabBarComponent extends Component {
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

		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Computed Properties
	get tabComponent() {
		return this?._getComputedSubcomponent?.('tab');
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
	_selectItem(item) {
		this.#debug?.(`_selectItem: `, item);
		if (!this.#element) return;

		if (!this.#items?.has?.(item)) {
			this.#debug?.(`Item not registered: `, item);
			return;
		}

		const selectedTab = this.#element?.querySelector?.(
			'button.mdc-tab--active'
		);

		if (selectedTab) {
			const selectedTabControls = this.#items?.get?.(selectedTab);
			selectedTabControls?.select?.(false);
		}

		const tabControls = this.#items?.get?.(item);
		tabControls?.select?.(true);

		this?._fireEvent?.('statuschange', {
			selected: item?.getAttribute?.('id'),
			unselected: selectedTab?.getAttribute?.('id')
		});
	}

	@action
	_fireEvent(name, options) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const status = Object?.assign?.(
			{},
			{
				selected: options?.selected,
				unselected: options?.unselected
			},
			options
		);

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: {
					selectItem: this?._selectItem
				},
				status: status
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
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
		tab: 'mdc-tab-bar/tab'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-tab-bar');

	#element = null;
	#items = new Map();
	// #endregion
}
