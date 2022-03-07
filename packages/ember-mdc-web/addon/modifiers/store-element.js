import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

export default class StoreElementModifier extends Modifier {
	// #region Accessed Services
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didReceiveArguments() {
		super.didReceiveArguments(...arguments);
		this.#debug?.(
			`didReceiveArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		if (this.#hasFired) {
			this.#debug?.(`hasFired: ${this.#hasFired}. Not calling back`);
			return;
		}

		this.#hasFired = true;

		const storeFunc = this?.args?.positional?.[0];
		storeFunc?.(this?.element, this?.args?.positional?.[1]);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:store-element');
	#hasFired = false;
	// #endregion
}
