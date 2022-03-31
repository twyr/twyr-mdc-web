import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ActionButtonComponent from './action-button/index';
import ActionIconComponent from './action-icon/index';

export default class MdcCardFooterComponent extends Component {
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
	get actionButtonComponent() {
		return this?._getComputedSubcomponent?.('actionButton');
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
		actionButton: ActionButtonComponent,
		actionIcon: ActionIconComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-footer');
	// #endregion
}
