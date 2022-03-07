import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

export default class OnArgsChangeModifier extends Modifier {
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

		const callback = this?.args?.positional?.[0];
		callback?.();
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:on-args-change');
	// #endregion
}
