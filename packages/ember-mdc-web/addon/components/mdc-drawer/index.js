import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import HeaderComponent from './header/index';
import ContentComponent from './content/index';

export default class MdcDrawerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setControlElement = this?._setControlElement;
		this.#controls.open = this?._open;
		this.#controls.close = this?._close;
		this.#controls.toggle = this?._toggle;

		if (this?.args?.open || this?.args?.locked) this.open = true;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?._fireEvent?.('unregister');
		this?._close?.();

		this.#controlElement = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClickOutside(event) {
		this.#debug?.(`onClickOutside: `, event);

		const isEventOnControl =
			event?.target === this.#controlElement?.element ||
			this.#controlElement?.element?.contains?.(event?.target);

		this.#debug(`onClickOutside::isEventOnControl: ${isEventOnControl}`);

		if (isEventOnControl) return;

		this?._close?.();
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	updateStatusToControl() {
		this.#debug?.(`updateStatusToControl`);
		if (!this.#controlElement) return;

		this.#controlElement?.controls?.setState?.({
			open: this?.open,
			locked: this?.args?.locked
		});
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		if (this.#element?.hasAttribute?.('open')) this?._open?.();

		this?._fireEvent?.('register');
	}
	// #endregion

	// #region Controls
	@action
	_open() {
		this.#debug?.(`_open`);
		this.open = true;

		this.#controlElement?.controls?.setState?.(this?.open);
		this?._fireEvent?.('statuschange');
	}

	@action
	_close() {
		this.#debug?.(`_close`);

		if (this?.args?.locked) return;

		this.open = false;
		this.#controlElement?.controls?.setState?.({
			open: this?.open,
			locked: this?.args?.locked
		});

		this?._fireEvent?.('statuschange');
	}

	@action
	_toggle() {
		this.#debug?.(`_toggle`);
		if (this?.open) {
			this?._close?.();
		} else {
			this?._open?.();
		}
	}

	@action
	_setControlElement(controlElement) {
		this.#debug?.(`_setControlElement: `, controlElement);
		this.#controlElement = controlElement;

		this.#controlElement?.controls?.setState?.({
			open: this?.open,
			locked: this?.args?.locked
		});
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
	_fireEvent(name) {
		this.#debug?.(`_fireEvent: ${name}`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				controls: this.#controls,
				status: {
					name: this?.args?.name ?? 'mdc-sidebar',
					open: this?.open,
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

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		header: HeaderComponent,
		content: ContentComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-drawer');
	#controls = {};

	#element = null;
	#controlElement = null;
	// #endregion
}
