import Component from './../mdc-list/item/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { cancel, later, scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class MdcMenuComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	itemControls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.barReady = this?._onBarReady;
		this.#controls.open = this?._openItem;
		this.#controls.status = this?._getStatus;

		this.itemControls.onTriggerEvent = this?.onTriggerEvent;
		this.itemControls.setControls = this?._setDropdownControls;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);

		if (this.#tempAddListenerTimeout) {
			cancel?.(this.#tempAddListenerTimeout);
			this.#tempAddListenerTimeout = null;
		}

		if (this.#initOpenListenerTimeout) {
			cancel?.(this.#initOpenListenerTimeout);
			this.#initOpenListenerTimeout = null;
		}

		if (this.#tempEventListenerAdded) {
			this.#element?.removeEventListener?.('click', this?.onClick);
			this.#tempEventListenerAdded = false;
		}

		this?.args?.menuControls?.registerItem?.(this.#element, null, false);

		this.#contentControls = null;
		this.#triggerControls = null;

		this.itemControls = {};
		this.#controls = {};

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onTriggerEvent(event) {
		this.#debug(`onTriggerEvent: `, event);
		if (!this.#element) return;
		if (this.#element?.hasAttribute?.('disabled')) return;

		if (this?.args?.menuControls) {
			this?.args?.menuControls?.openItem?.(this.#element, true);
			return;
		}

		this?._openItem?.(!this?.open);
	}

	@action
	onClick(event) {
		this.#debug(`onClick: `, event);

		if (!this.#element) return;
		if (this.#element?.hasAttribute?.('disabled')) return;

		super.onClick?.(event);

		if (this?.args?.menuControls)
			this?.args?.menuControls?.openItem?.(this.#element, !this?.open);
		else this?._openItem?.(!this?.open);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	notOnClick(event) {
		this.#debug(`closeSubmenus: `, event);
		if (!this?.open) return;

		if (this?.args?.menuControls) return;

		this?._openItem?.(false);
	}

	@action
	listenToClicks() {
		this.#debug(`listenToClicks::triggerEvent: ${this?.triggerEvent}`);
		if (!this.#element) return;

		if (this?.triggerEvent === 'click' && this.#tempEventListenerAdded) {
			this.#debug(
				`listenToClicks::triggerEvent::${this?.triggerEvent}: removing event listener`
			);

			this.#element?.removeEventListener?.('click', this?.onClick);
			this.#tempEventListenerAdded = false;

			return;
		}

		if (this.#tempEventListenerAdded) return;

		this.#debug(
			`listenToClicks::triggerEvent::${this?.triggerEvent}: adding event listener`
		);
		this.#tempAddListenerTimeout = later?.(
			this,
			() => {
				this.#tempAddListenerTimeout = null;
				this.#tempEventListenerAdded = true;

				this.#element?.addEventListener?.('click', this?.onClick);
			},
			1
		);
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;

		if (this?.args?.menuControls)
			this?.args?.menuControls?.registerItem?.(
				this.#element,
				this.#controls,
				true
			);
		else this?._onBarReady?.();
	}
	// #endregion

	// #region Controls
	@action
	_onBarReady() {
		this.#debug(`_onBarReady`);

		if (!this.#element?.hasAttribute?.('open')) return;
		// this?.args?.menuControls?.openItem?.(this.#element, true);

		// TODO: Why is this timeout needed? Where are we setting
		// open twice in this sequence??
		this.#initOpenListenerTimeout = scheduleOnce?.(
			'afterRender',
			this,
			this?._setupInitOpenState
		);
	}

	@action
	_openItem(open) {
		this.#debug(`_openItem: ${open}`);
		this.open = open;

		this.#triggerControls?.openItem?.(open);
	}

	@action
	_getStatus() {
		this.#debug(`_getStatus`);
		return {
			open: this?.open,
			disabled: this.#element?.hasAttribute?.('disabled')
		};
	}

	@action
	_setDropdownControls(position, controls) {
		this.#debug(`_setDropdownControls::${position}`, controls);
		if (position === 'trigger') {
			this.#triggerControls = controls;
			return;
		}

		if (position === 'content') {
			this.#contentControls = controls;
			this.#contentControls?.openItem?.(true);
		}
	}
	// #endregion

	// #region Computed Properties
	get triggerEvent() {
		return this?.args?.triggerEvent ?? 'mouseup';
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}

	get listComponent() {
		return this?._getComputedSubcomponent?.('list');
	}
	// #endregion

	// #region Private Methods
	_setupInitOpenState() {
		this.#initOpenListenerTimeout = null;

		if (this?.args?.menuControls) {
			this?.args?.menuControls?.openItem?.(this.#element, true);
			return;
		}

		this?._openItem?.(true);
	}

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
		list: 'mdc-menu/list',
		trigger: 'mdc-menu/trigger'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu');

	#element = null;
	#controls = {};

	#triggerControls = null;
	#contentControls = null;

	#tempEventListenerAdded = false;
	#tempAddListenerTimeout = null;

	#initOpenListenerTimeout = null;
	// #endregion
}
