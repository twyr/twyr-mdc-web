import Component from './../mdc-abstract-dropdown/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ListComponent from './list/index';
import TriggerComponent from './trigger/index';

export default class MdcSelectComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.setSelectValue = this?._setValue;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);

		this.#element = null;

		delete this.controls.setSelectValue;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	notOnClick(event) {
		this.#debug(`notOnClick: `, event);
		if (!this?.open) return;

		this?._close?.();
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
	}
	// #endregion

	// #region Controls
	@action
	_setValue(value, text) {
		this.#debug?.(`_setValue: ${value} [${text}]`);
		if (!this.#element || this.#element?.hasAttribute?.('disabled')) return;

		this.#value = value;
		this.#text = text;

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);

		this?._fireEvent?.('change');
	}
	// #endregion

	// #region Computed Properties
	get tag() {
		return 'div';
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}

	get listComponent() {
		return this?._getComputedSubcomponent?.('list');
	}
	// #endregion

	// #region Private Methods
	_setupStatus() {
		const status = super._setupStatus?.();

		status.value = this.#value;
		status.text = this.#text;

		status.required = this.#element?.hasAttribute?.('required');

		this.#debug?.(`_setupStatus: `, status);
		return status;
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
		list: ListComponent,
		trigger: TriggerComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select');
	#element = null;

	#value = '';
	#text = '';
	// #endregion
}
