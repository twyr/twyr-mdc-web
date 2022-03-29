import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ActionButtonComponent from './action-button/index';

export default class MdcDialogFooterComponent extends Component {
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
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		actionButton: ActionButtonComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-dialog-footer');
	// #endregion
}
