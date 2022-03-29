import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import DividerComponent from './divider/index';
import ListItemComponent from './item/index';

export default class MdcListComponent extends Component {
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

		this.controls.registerItem = this?._registerItem;
		this.controls.selectItem = this?._selectItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#items?.clear?.();
		this.controls = {};

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		if (this?.args?.listGroupControls) return;

		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Controls
	@action
	_registerItem(item, controls, register) {
		this.#debug?.(`_registerItem: `, item, controls, register);

		if (this?.args?.listGroupControls) {
			this?.args?.listGroupControls?.registerItem?.(
				item,
				controls,
				register
			);
			return;
		}

		if (!register) {
			this.#items?.delete?.(item);
			return;
		}

		this.#items?.set?.(item, controls);
	}

	@action
	_selectItem(item, selected) {
		this.#debug?.(`_selectItem: `, item);

		if (this?.args?.listGroupControls) {
			this?.args?.listGroupControls?.selectItem?.(item, selected);
			return;
		}

		if (!this.#items?.has?.(item)) {
			this.#debug?.(`Item not registered: `, item);
			return;
		}

		const selectedItem = this.#element?.querySelector?.(
			'li.mdc-list-item--selected'
		);
		if (selectedItem) {
			const selectedItemControls = this.#items?.get?.(selectedItem);
			selectedItemControls?.select?.(false);
		}

		const listItemControls = this.#items?.get?.(item);
		listItemControls?.select?.(selected);

		const eventData = {
			selected: selected ? item?.id : null,
			unselected: selectedItem?.id
		};
		this?._fireEvent?.('select', eventData);
	}
	// #endregion

	// #region Computed Properties
	get dividerComponent() {
		return this?._getComputedSubcomponent?.('divider');
	}

	get listItemComponent() {
		return this?._getComputedSubcomponent?.('listItem');
	}
	// #endregion

	// #region Private Methods
	_fireEvent(name, options) {
		this.#debug?.(`_fireEvent::${name}: `, options);
		if (!this.#element) return;

		const status = Object?.assign?.({}, options);
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

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return ensureSafeComponent(subComponent);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		divider: DividerComponent,
		listItem: ListItemComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list');

	#element = null;
	#items = new Map();
	// #endregion
}
