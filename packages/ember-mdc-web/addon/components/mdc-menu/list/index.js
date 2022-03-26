import Component from './../../mdc-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcMenuListComponent extends Component {
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

		this.#controls.openItem = this?._openItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);

		this.#controls = {};
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	async storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement(element);

		this.#element = element;
		this?.args?.itemControls?.setControls?.('content', this.#controls);
	}
	// #endregion

	// #region Controls
	@action
	_openItem(open) {
		this.#debug?.(`_openItem: `, open);
		if (!this.#element) return;

		if (open) {
			this.#element?.classList?.add?.('mdc-menu-surface--open');
			return;
		}

		this.#element?.classList?.remove?.('mdc-menu-surface--open');
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
	#debug = debugLogger('component:mdc-menu-list');

	#element = null;
	#controls = {};
	// #endregion
}
