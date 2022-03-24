import Component from './../../mdc-list/item/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { cancel, later } from '@ember/runloop';

export default class MdcMenuItemComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	itemControls = {};

	open = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.barReady = this?._onBarReady;
		this.controls.open = this?._openItem;
		this.controls.status = this?._getStatus;

		this.itemControls.onTriggerEvent = this?.onTriggerEvent;
		this.itemControls.setControls = this?._setControls;
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

		this?.args?.menuControls?.registerItem?.(this.#element, null, false);
		this.#triggerControls = null;

		this.itemControls = {};
		this.controls = {};

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onTriggerEvent(open, event) {
		this.#debug(`onTriggerEvent::${open}`, event);
		if (!this.#element) return;
		if (this.#element?.hasAttribute?.('disabled')) return;

		this?.args?.menuControls?.openItem?.(this.#element, open);
	}

	@action
	onClick(event) {
		this.#debug(`onClick: `, event);

		if (!this.#element) return;
		if (this.#element?.hasAttribute?.('disabled')) return;

		super.onClick?.(event);
		this?.args?.menuControls?.openItem?.(this.#element, !this?.open);
	}
	// #endregion

	// #region Modifier Callbacks
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
		this?.args?.menuControls?.registerItem?.(
			this.#element,
			this.controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_onBarReady() {
		this.#debug(`_onBarReady`);

		if (!this.#element?.hasAttribute?.('open')) return;

		// TODO: Why is this timeout needed? Where are we setting
		// open twice in this sequence??
		this.#initOpenListenerTimeout = later?.(
			this,
			() => {
				this?.args?.menuControls?.openItem?.(this.#element, true);
				this.#initOpenListenerTimeout = null;
			},
			5
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
	_setControls(controls) {
		this.#debug(`_setDropdownControls: `, controls);
		this.#triggerControls = controls;
	}
	// #endregion

	// #region Computed Properties
	get triggerEvent() {
		return this?.args?.triggerEvent ?? 'mouseup';
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
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
		list: 'mdc-menu/item/list',
		trigger: 'mdc-menu/item/trigger'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-item');

	#element = null;
	#triggerControls = null;

	#tempEventListenerAdded = false;
	#tempAddListenerTimeout = null;

	#initOpenListenerTimeout = null;
	// #endregion
}
