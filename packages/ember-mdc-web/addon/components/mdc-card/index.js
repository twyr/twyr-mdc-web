import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcCardComponent extends Component {
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
	get headerComponent() {
		return this?._getComputedSubcomponent?.('header');
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}

	get footerComponent() {
		return this?._getComputedSubcomponent?.('footer');
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
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		header: 'mdc-card/header',
		content: 'mdc-card/content',
		footer: 'mdc-card/footer'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card');
	// #endregion
}
