import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcDialogFooterComponent extends Component {
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
	get actionButtonComponent() {
		return this?._getComputedSubcomponent?.('actionButton');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];
		this.#debug?.(`${componentName}-component`, subComponent);

		return subComponent;
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		actionButton: 'mdc-dialog/footer/action-button'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-dialog-footer');
	// #endregion
}
