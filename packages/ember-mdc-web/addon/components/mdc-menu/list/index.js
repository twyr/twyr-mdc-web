import Component from './../../../../node_modules/@twyr/ember-abstract-dropdown/dist/_app_/components/ember-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import DividerComponent from './../divider/index';
import ItemComponent from './../item/index';

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
		super.recalcStyles?.();
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		super.storeElement?.(element);
		this.#element = element;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get dividerComponent() {
		return this?._getComputedSubcomponent?.('divider');
	}

	get itemComponent() {
		return this?._getComputedSubcomponent?.('item');
	}
	// #endregion

	// #region Private Methods
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
		item: ItemComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-list');
	#element = null;
	// #endregion
}
