import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

export default class MdcListGroupHeaderComponent extends Component {
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

		return `mdc-theme--${this?.args?.palette}`;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list-group-header');
	// #endregion
}
