import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcCardHeaderComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
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
		this.#debug(`${componentName}-component`, subComponent);

		return subComponent;
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		headline: 'mdc-headline',
		subheadline: 'mdc-sub-headline'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-header');
	// #endregion
}
