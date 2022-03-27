import Component from './../../mdc-abstract-dropdown/content/index';
import debugLogger from 'ember-debug-logger';

export default class MdcSelectListComponent extends Component {
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
	willDestroy() {
		this.#debug?.(`willDestroy`);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get matchTriggerWidth() {
		return true;
	}

	get xAlign() {
		return 'left';
	}

	get xOffset() {
		return '0';
	}

	get yAlign() {
		return 'bottom';
	}

	get yOffset() {
		return '0';
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-select-list');
	// #endregion
}
