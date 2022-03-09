import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcDrawerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked isOpen = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setControlElement = this?._setControlElement;
		this.#controls.open = this?._open;
		this.#controls.close = this?._close;
		this.#controls.toggle = this?._toggle;

		if (this?.args?.open || this?.args?.locked) this.isOpen = true;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?._fireEvent?.('unregister');

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClickOutside(event) {
		this.#debug?.(`onClickOutside: `, event);

		const isEventOnControl =
			event.target === this.#controlElement ||
			this.#controlElement?.contains?.(event.target);

		if (isEventOnControl) {
			this.#debug?.(
				`onClickOutside::isEventOnControl: ${isEventOnControl}`
			);
			return;
		}

		this?._close?.();
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?._fireEvent?.('register');
	}
	// #endregion

	// #region Computed Properties
	get headerComponent() {
		return this?._getComputedSubcomponent?.('header');
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}
	// #endregion

	// #region Private Methods
	@action
	_open() {
		this.#debug?.(`_open`);

		this.isOpen = true;
		this?._fireEvent?.('statuschange');
	}

	@action
	_close() {
		this.#debug?.(`_close`);

		if (this?.args?.locked) {
			this.#debug?.(`_close: sidebar is locked. aborting...`);
			return;
		}

		this.isOpen = false;
		this?._fireEvent?.('statuschange');
	}

	@action
	_toggle() {
		this.#debug?.(`_toggle`);
		if (this?.isOpen) {
			this?._close?.();
		} else {
			this?._open?.();
		}
	}

	@action
	_setControlElement(controlElement) {
		this.#debug?.(`_setControlElement: `, controlElement);
		this.#controlElement = controlElement;
	}

	@action
	_fireEvent(name) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					name: this?.args?.name ?? 'mdc-sidebar',
					open: this?.isOpen,
					locked: this?.args?.locked,
					modal: this?.args?.modal
				}
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
		header: 'mdc-drawer/header',
		content: 'mdc-drawer/content'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-drawer');

	#element = null;
	#controlElement = null;

	#controls = {};
	// #endregion
}
