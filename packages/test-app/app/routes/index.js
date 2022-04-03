import Route from '@ember/routing/route';
import debugLogger from 'ember-debug-logger';

export default class IndexRoute extends Route {
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
	beforeModel(transition) {
		this.#debug?.(`beforeModel: `, transition);
		this?.transitionTo?.('showcase');
		return null;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('route:index');
	// #endregion
}
