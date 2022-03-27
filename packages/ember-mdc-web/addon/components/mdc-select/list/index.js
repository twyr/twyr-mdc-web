import Component from './../../mdc-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcSelectListComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked required = false;
	@tracked value = null;
	@tracked text = null;
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
		this.#debug?.(`willDestroy`);
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
		super.storeElement(element);

		this.#element = element;

		this?._setupInitState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	@action
	_setDropdownStatus(dropdownStatus) {
		this.#debug?.(`_setDropdownStatus: `, dropdownStatus);
		super._setDropdownStatus?.(dropdownStatus);

		this.required = dropdownStatus?.required;
		this.value = dropdownStatus?.value;
		this.text = dropdownStatus?.text;

		this?._setupInitState?.();
		this?.recalcStyles?.();
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

	get listItemComponent() {
		return this?._getComputedSubcomponent?.('listItem');
	}
	// #endregion

	// #region Private Methods
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
		listItem: 'mdc-list/item'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-list');
	#element = null;
	// #endregion
}
