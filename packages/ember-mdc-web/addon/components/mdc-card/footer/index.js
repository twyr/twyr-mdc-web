import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

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

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return subComponent;
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		actionButton: 'mdc-card/footer/action-button',
		actionIcon: 'mdc-card/footer/action-icon'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-footer');
	// #endregion
}
