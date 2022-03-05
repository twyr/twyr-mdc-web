import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { v4 as uuidv4 } from 'uuid';

export default class MdcRadioGroupComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.register = this?._registerRadio;
		this.controls.selectRadio = this?._selectRadio;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#radios?.clear?.();
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?._fireEvent?.({
			name: 'init'
		});
	}
	// #endregion

	// #region Computed Properties
	get groupName() {
		return this?.args?.groupName ?? uuidv4();
	}

	get radioComponent() {
		return this?._getComputedSubcomponent?.('radio');
	}
	// #endregion

	// #region Private Methods
	@action
	_registerRadio(radio, controls, register) {
		this.#debug?.(`_registerItem: `, radio, controls, register);

		if (!register) {
			this.#radios?.delete?.(radio);
			return;
		}

		this.#radios?.set?.(radio, controls);
	}

	@action
	_selectRadio(radio, state) {
		this.#debug?.(`_setRadioState: `, radio);

		if (!this.#radios?.has?.(radio)) {
			this.#debug?.(`Radio not registered: `, radio);
			return;
		}

		const eventData = {
			name: 'statuschange',
			radio: radio?.getAttribute?.('id'),
			status: state
		};

		this?._fireEvent?.(eventData);
	}

	@action
	_setRadioState(radio, state) {
		this.#debug?.(`_setRadioState: `, radio);

		if (!this.#radios?.has?.(radio)) {
			this.#debug?.(`Radio not registered: `, radio);
			return;
		}

		const radioControls = this.#radios?.get?.(radio);
		radioControls?.setState?.(state);
	}

	@action
	_fireEvent(data) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(data?.name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: {
					selectRadio: this?._setRadioState
				},
				status: {
					radio: data?.radio,
					checked: data?.status?.checked,
					disabled: data?.status?.disabled
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
		radio: 'mdc-radio-group/radio'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-radio-group');

	#element = null;
	#radios = new Map();
	// #endregion
}
