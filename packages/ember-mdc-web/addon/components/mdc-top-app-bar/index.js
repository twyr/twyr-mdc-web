import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcTopAppBarComponent extends Component {
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
		this.#debug?.(`${componentName}-component`, subComponent);

		return subComponent;
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		navigationIcon: 'mdc-top-app-bar/navigation-icon',
		actionIcon: 'mdc-top-app-bar/action-icon'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-top-app-bar');
	// #endregion
}
