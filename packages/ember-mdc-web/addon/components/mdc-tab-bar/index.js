import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import TabComponent from './tab/index';

export default class MdcTabBarComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked scrollEnabled = false;
	@tracked leftScrollEnabled = false;
	@tracked rightScrollEnabled = false;
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.registerTab = this?._registerTab;
		this.controls.selectTab = this?._selectTab;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#tabs?.clear?.();
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	handleScroll(direction) {
		this.#debug?.(`handleScroll: ${direction}`);

		if (direction === 'left') {
			this?._scrollLeft?.();
		} else {
			this?._scrollRight?.();
		}
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	shouldEnableScroll() {
		if (!this.#element) return;

		this.scrollEnabled = this?._shouldEnableScrollArea?.();
		this.leftScrollEnabled = this?._shouldEnableScrollLeft?.();
		this.rightScrollEnabled = this?._shouldEnableScrollRight?.();

		this.#debug?.(
			`shouldEnableScroll: ${this.scrollEnabled}, LeftScroll Enabled: ${this?.leftScrollEnabled}, Right Scroll Enabled: ${this?.rightScrollEnabled}`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this?._setComponentState?.();

		this.#tabs?.forEach?.((tabControls) => {
			tabControls?.barReady?.();
		});

		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Controls
	@action
	_registerTab(tab, controls, register) {
		this.#debug?.(`_registerTab: `, tab, controls, register);

		if (!register) {
			this.#tabs?.delete?.(tab);
			return;
		}

		this.#tabs?.set?.(tab, controls);
		if (!this.#element) return;

		controls?.barReady?.();
	}

	@action
	_selectTab(tab) {
		this.#debug?.(`_selectTab: `, tab);
		if (!this.#element) return;

		if (!this.#tabs?.has?.(tab)) {
			this.#debug?.(`_selectTab::Tab not registered: `, tab);
			return;
		}

		const selectedTab = this.#element?.querySelector?.(
			'button.mdc-tab--active'
		);

		if (selectedTab) {
			const selectedTabControls = this.#tabs?.get?.(selectedTab);
			selectedTabControls?.select?.(false);
		}

		const tabControls = this.#tabs?.get?.(tab);
		tabControls?.select?.(true);

		// See if we need to bring this tab into the viewport
		// And if we do, scroll appropriately
		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		const scrollAreaRect = scrollAreaElement?.getBoundingClientRect?.();
		const tabRect = tab?.getBoundingClientRect?.();

		// TODO: What do we do if both conditions are right?
		// Small screen, and a huge tab???
		if (tabRect?.left < scrollAreaRect?.left) {
			scrollAreaElement.scrollLeft -= tabRect.width;
			this?._setComponentState?.();
		}

		if (tabRect?.right > scrollAreaRect?.right) {
			scrollAreaElement.scrollLeft += tabRect.width;
			this?._setComponentState?.();
		}

		this?._fireEvent?.('statuschange', {
			selected: tab?.id,
			unselected: selectedTab?.id
		});
	}
	// #endregion

	// #region Computed Properties
	get tabComponent() {
		return this?._getComputedSubcomponent?.('tab');
	}
	// #endregion

	// #region Private Methods
	_fireEvent(name, options) {
		this.#debug?.(`_fireEvent::${name}: `, options);
		if (!this.#element) return;

		const status = Object?.assign?.({}, options);
		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				controls: {
					selectTab: this?._selectTab
				},
				status: status
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	_scrollLeft() {
		this.#debug?.(`_scrollLeft`);

		const lastInvisibleTabRect = this?._shouldEnableScrollLeft?.();
		this.leftScrollEnabled = !!lastInvisibleTabRect;

		this.#debug?.(`_scrollLeft: ${this?.leftScrollEnabled}`);
		if (!this?.leftScrollEnabled) return;

		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		scrollAreaElement.scrollLeft -= lastInvisibleTabRect.width;

		this?._setComponentState?.();
	}

	_scrollRight() {
		this.#debug?.(`_scrollRight`);

		const firstInvisibleTabRect = this?._shouldEnableScrollRight?.();
		this.rightScrollEnabled = !!firstInvisibleTabRect;

		this.#debug?.(`_scrollRight: ${this?.rightScrollEnabled}`);
		if (!this?.rightScrollEnabled) return;

		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		scrollAreaElement.scrollLeft += firstInvisibleTabRect.width;

		this?._setComponentState?.();
	}

	_setComponentState() {
		this.#debug?.(`_setComponentState`);

		this.scrollEnabled = this?._shouldEnableScrollArea?.();
		this.leftScrollEnabled = this?._shouldEnableScrollLeft?.();
		this.rightScrollEnabled = this?._shouldEnableScrollRight?.();
	}

	_shouldEnableScrollArea() {
		const scrollAreaDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-area')
			?.getBoundingClientRect?.();

		const scrollContentDimensions = this.#element
			?.querySelector?.('div.mdc-tab-scroller__scroll-content')
			?.getBoundingClientRect?.();

		const shouldEnable =
			scrollAreaDimensions?.width < scrollContentDimensions?.width;
		this.#debug?.(`_shouldEnableScrollArea: ${shouldEnable}`);

		return shouldEnable;
	}

	_shouldEnableScrollLeft() {
		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		const scrollAreaRect = scrollAreaElement?.getBoundingClientRect?.();

		let lastInvisibleTabRect = null;

		const tabs = scrollAreaElement?.querySelectorAll?.('button.mdc-tab');
		for (let idx = 0; idx < tabs?.length; idx++) {
			const thisTab = tabs[idx];
			const tabRect = thisTab?.getBoundingClientRect?.();

			if (tabRect?.left >= scrollAreaRect?.left) break;

			lastInvisibleTabRect = tabRect;
		}

		this.#debug?.(`_shouldEnableScrollLeft: ${!!lastInvisibleTabRect}`);
		return lastInvisibleTabRect;
	}

	_shouldEnableScrollRight() {
		const scrollAreaElement = this.#element?.querySelector?.(
			'div.mdc-tab-scroller__scroll-area'
		);
		const scrollAreaRect = scrollAreaElement?.getBoundingClientRect?.();

		let firstInvisibleTabRect = null;

		const tabs = scrollAreaElement?.querySelectorAll?.('button.mdc-tab');
		for (let idx = tabs?.length - 1; idx >= 0; idx--) {
			const thisTab = tabs[idx];
			const tabRect = thisTab?.getBoundingClientRect?.();

			if (tabRect?.right <= scrollAreaRect?.right) break;

			firstInvisibleTabRect = tabRect;
		}

		this.#debug?.(`_shouldEnableScrollRight: ${!!firstInvisibleTabRect}`);
		return firstInvisibleTabRect;
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		tab: TabComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-tab-bar');

	#element = null;
	#tabs = new Map();
	// #endregion
}
