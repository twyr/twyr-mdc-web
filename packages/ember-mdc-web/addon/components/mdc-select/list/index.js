import Component from './../../mdc-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import DividerComponent from './../../mdc-list/divider/index';
import OptionComponent from './../option/index';

export default class MdcSelectListComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
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

		this.#options?.clear?.();
		this.#element = null;

		this.controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;

		this?._setComponentState?.();
		this?.recalcStyles?.();

		if (!this.#selectInit) return;

		this.#options?.forEach?.((optionControls) => {
			optionControls?.listReady?.();
		});
	}
	// #endregion

	// #region Controls
	@action
	_optionClicked(value, text) {
		this.#debug?.(`_optionClicked: ${value}[${text}]:`);
		this?.args?.dropdownControls?.setSelectValue?.(value, text);
	}

	@action
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);
		super._setDropdownStatus?.(dropdownStatus);

		if (this.#selectInit) {
			this?._setComponentState?.();
			this?.recalcStyles?.();

			const selectedOption = this.#element?.querySelector?.(
				`li.mdc-list-item[value="${dropdownStatus?.value}"]`
			);

			this?._selectOption?.(selectedOption, true);
			return;
		}

		this.#selectInit = true;
		if (!this.#element) return;

		this.#options?.forEach?.((optionControls) => {
			optionControls?.listReady?.();
		});
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
		if (!this.#selectInit) return;

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
	_setComponentState() {
		if (!this.disabled) return;
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
		divider: DividerComponent,
		option: OptionComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-list');

	#element = null;
	#options = new Map();

	#selectInit = false;
	// #endregion
}
