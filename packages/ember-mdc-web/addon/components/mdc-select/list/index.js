import Component from './../../mdc-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { cancel, scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

import { ensureSafeComponent } from '@embroider/util';

export default class MdcSelectListComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked required = false;
	@tracked value = null;
	@tracked text = null;
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.registerOption = this?._registerOption;
		this.controls.selectOption = this?._optionClicked;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		if (this.#selectInit) {
			cancel?.(this.#selectInit);
			this.#selectInit = false;
		}

		this.#options?.clear?.();
		this.controls = {};

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;
	}

	@action
	async storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		super.storeElement(element);

		this?._setupInitState?.();
		this?.recalcStyles?.();

		this.#options?.forEach?.((optionControls) => {
			optionControls?.listReady?.();
		});
	}
	// #endregion

	// #region Controls
	@action
	_optionClicked(value, text) {
		this.#debug?.(`_optionClicked: ${value}[${text}]:`);

		if (this.#selectInit) {
			this?.args?.dropdownControls?.setSelectValue?.(value, text);
			return;
		}

		this.value = value;
		this.text = text;
	}

	@action
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);
		super._setDropdownStatus?.(dropdownStatus);

		if (this.#selectInit) {
			this.required = dropdownStatus?.required;
			this.value = dropdownStatus?.value;
			this.text = dropdownStatus?.text;

			this?._setupInitState?.();
			this?.recalcStyles?.();

			const selectedOption = this.#element?.querySelector?.(
				`li.mdc-list-item[value="${this.value}"]`
			);
			this?._selectOption?.(selectedOption, true);

			return;
		}

		this.#selectInit = scheduleOnce?.(
			'afterRender',
			this,
			this?._optionClicked,
			this.value,
			this.text
		);
	}

	@action
	_registerOption(option, controls, register) {
		this.#debug?.(`_registerOption: `, option, controls, register);

		if (!register) {
			this.#options?.delete?.(option);
			return;
		}

		this.#options?.set?.(option, controls);
		if (!this.#element) return;

		controls?.listReady?.();
	}

	@action
	_selectOption(option, selected) {
		this.#debug?.(`_selectOption: `, option);

		if (!this.#options?.has?.(option)) {
			this.#debug?.(`Option not registered: `, option);
			return;
		}

		const selectedOption = this.#element?.querySelector?.(
			'li.mdc-list-item--selected'
		);
		if (selectedOption) {
			const selectedOptionControls = this.#options?.get?.(selectedOption);
			selectedOptionControls?.select?.(false);
		}

		const optionControls = this.#options?.get?.(option);
		optionControls?.select?.(selected);

		const eventData = {
			selected: selected ? option?.id : null,
			unselected: selectedOption?.id
		};

		this?._fireEvent?.('select', eventData);
	}
	// #endregion

	// #region Computed Properties
	get matchTriggerWidth() {
		return true;
	}

	get xAlign() {
		return 'left';
	}

	get xOffset() {
		return '0';
	}

	get yAlign() {
		return 'bottom';
	}

	get yOffset() {
		return '0';
	}

	get dividerComponent() {
		return this?._getComputedSubcomponent?.('divider');
	}

	get optionComponent() {
		return this?._getComputedSubcomponent?.('option');
	}

	get emptyOptionComponent() {
		return ensureSafeComponent(this?.optionComponent, this);
	}
	// #endregion

	// #region Private Methods
	_fireEvent(name, options) {
		this.#debug?.(`_fireEvent::${name}: `, options);
		if (!this.#element) return;

		const status = Object?.assign?.(
			{},
			{
				open: this?.open,

				disabled: this?.disabled,
				required: this?.required,

				value: this?.value,
				text: this?.text
			},
			options
		);

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				controls: {
					selectItem: this?._selectItem
				},
				status: status
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	_setupInitState() {
		if (!this.disabled) return;
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
		divider: 'mdc-list/divider',
		option: 'mdc-select/option'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-list');

	#element = null;
	#options = new Map();

	#selectInit = false;
	// #endregion
}
