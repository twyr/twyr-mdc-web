import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import HeadlineComponent from './../../mdc-headline/index';
import SubHeadlineComponent from './../../mdc-sub-headline/index';

export default class MdcDrawerHeaderComponent extends Component {
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
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get paletteStyle() {
		if (!this?.args?.palette) return null;

		return `mdc-theme--${this?.args?.palette}-bg mdc-theme--on-${this?.args?.palette}`;
	}

	get headlineComponent() {
		return this?._getComputedSubcomponent?.('headline');
	}

	get subHeadlineComponent() {
		return this?._getComputedSubcomponent?.('subheadline');
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
		return ensureSafeComponent(subComponent, this);
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		headline: HeadlineComponent,
		subheadline: SubHeadlineComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-drawer-header');
	// #endregion
}
