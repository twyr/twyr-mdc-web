import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcCardContentComponent extends Component {
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
	get titleComponent() {
		return this?._getComputedSubcomponent?.('title');
	}

	get subtitleComponent() {
		return this?._getComputedSubcomponent?.('subtitle');
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
		title: 'mdc-headline',
		subtitle: 'mdc-sub-headline',
		media: 'mdc-card/content/media'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-content');
	// #endregion
}
