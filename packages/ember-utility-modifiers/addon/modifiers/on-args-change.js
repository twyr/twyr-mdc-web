import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';

export default class OnArgsChangeModifier extends Modifier {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor / Destructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		registerDestructor(this, this.destructor);
	}

	destructor() {
		// this.#debug?.(`destructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	modify(element, positional) {
		super.modify?.(...arguments);

		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\ncallback: `,
			positional?.[0]
		);

		const callback = positional?.[0];
		const changedArgs = positional?.slice?.(1);

		callback?.(changedArgs);
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
