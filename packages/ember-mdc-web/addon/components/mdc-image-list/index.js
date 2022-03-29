import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import RegularItemComponent from './regular-item/index';
import MasonryItemComponent from './masonry-item/index';

export default class MdcImageListComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get itemComponent() {
		return this?._getComputedSubcomponent?.(
			this?.args?.masonry ? 'masonry' : 'regular'
		);
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
		return ensureSafeComponent(subComponent);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		regular: RegularItemComponent,
		masonry: MasonryItemComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-image-list');
	// #endregion
}
