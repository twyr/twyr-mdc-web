import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcTabBarComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked scrollEnabled = false;
	@tracked rightScrollDisabled = false;
	@tracked leftScrollDisabled = false;

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
	shouldEnableScroll() {
		this.#debug?.(`shouldEnableScroll`);
		if (!this.#element) return;

		const scrollAreaDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-area')
			?.getBoundingClientRect?.();

		const scrollContentDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-content')
			?.getBoundingClientRect?.();

		const scrollEnabled =
			scrollAreaDimensions?.width < scrollContentDimensions?.width;
		if (scrollEnabled === this.scrollEnabled) return;

		this.#debug?.(
			`shouldEnableScroll:\nScroll Area Width ${scrollAreaDimensions?.width}\nScroll Content Width ${scrollContentDimensions?.width}`
		);

		this.scrollEnabled = scrollEnabled;
		this.#debug?.(`shouldEnableScroll: ${this.scrollEnabled}`);
	}

	@action
	handleScroll(direction) {
		this.#debug?.(`handleScroll: ${direction}`);

		if (direction === 'left') this?._scrollLeft?.();
		else this?._scrollRight?.();
	}

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
		} else {
			this.#items?.set?.(item, controls);
		}
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

	_scrollLeft() {
		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		const scrollAreaRect = scrollAreaElement?.getBoundingClientRect?.();

		let lastInvisibleTabRect = null;

		const tabs = scrollAreaElement?.querySelectorAll?.('button.mdc-tab');
		for (let idx = 0; idx < tabs?.length; idx++) {
			const thisTab = tabs[idx];
			const tabRect = thisTab?.getBoundingClientRect?.();

			if (tabRect?.left <= scrollAreaRect?.left) {
				lastInvisibleTabRect = tabRect;
				continue;
			}

			break;
		}

		if (!lastInvisibleTabRect) return;
		scrollAreaElement.scrollLeft -= lastInvisibleTabRect.width;
	}

	_scrollRight() {
		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		const scrollAreaRect = scrollAreaElement?.getBoundingClientRect?.();

		let firstInvisibleTabRect = null;

		const tabs = scrollAreaElement?.querySelectorAll?.('button.mdc-tab');
		for (let idx = 0; idx < tabs?.length; idx++) {
			const thisTab = tabs[idx];
			const tabRect = thisTab?.getBoundingClientRect?.();

			if (tabRect?.right <= scrollAreaRect?.right) continue;

			firstInvisibleTabRect = tabRect;
			break;
		}

		if (!firstInvisibleTabRect) return;
		scrollAreaElement.scrollLeft += firstInvisibleTabRect.width;
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
