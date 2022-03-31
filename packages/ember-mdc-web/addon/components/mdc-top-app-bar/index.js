import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ActionIconComponent from './action-icon/index';
import NavigationIconComponent from './navigation-icon/index';

export default class MdcTopAppBarComponent extends Component {
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

		this.#debug?.(
			`paletteStyle: mdc-theme--${this?.args?.palette}-bg mdc-theme--on-${this?.args?.palette}`
		);
		return `mdc-theme--${this?.args?.palette}-bg mdc-theme--on-${this?.args?.palette}`;
	}

	get navigationIconComponent() {
		return this?._getComputedSubcomponent?.('navigationIcon');
	}

	get actionIconComponent() {
		return this?._getComputedSubcomponent?.('actionIcon');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		navigationIcon: NavigationIconComponent,
		actionIcon: ActionIconComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-top-app-bar');
	// #endregion
}
