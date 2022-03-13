import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcTabBarComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked scrollEnabled = false;
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

		this?._shouldEmableScroll?.();
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
		} else {
			this.#items?.set?.(item, controls);
		}

		this?._shouldEmableScroll?.();
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
	_shouldEmableScroll() {
		this.#debug?.(`_shouldEmableScroll`);
		if (!this.#element) return;

		const scrollAreaDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-area')
			?.getBoundingClientRect?.();
		const scrollContentDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-content')
			?.getBoundingClientRect?.();

		this.#debug?.(
			`_shouldEmableScroll:\nScroll Area Width ${scrollAreaDimensions?.width}\nScroll Content Width ${scrollContentDimensions?.width}`
		);
		if (scrollAreaDimensions?.width >= scrollContentDimensions?.width) {
			this.#debug?.(`_shouldEmableScroll: No need for scrolling`);
			return;
		}

		this.#debug?.(`_shouldEmableScroll: ENABLE: TAB SCROLL`);
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
