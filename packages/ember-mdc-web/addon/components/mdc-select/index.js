import Component from './../mdc-abstract-dropdown/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

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
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);
		this.#element = null;

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
		this.#element = element;

		super.storeElement?.(element);
	}
	// #endregion

	// #region Controls
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

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		list: 'mdc-select/list',
		trigger: 'mdc-select/trigger'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select');
	#element = null;

	#value = '123456';
	#text = 'Yoo, hoo, hoo...';
	// #endregion
}
