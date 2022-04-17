import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';

export default class StoreElementModifier extends Modifier {
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
	modify(element, [callback], named) {
		super.modify?.(...arguments);
		if (this.#element === element && this.#callback === callback) return;

		this.#debug?.(`modify:\nelement: `, element);

		this.#element = element;
		this.#callback = callback;

		this.#callback?.(this.#element, named);
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

	#element = null;
	#callback = null;
	// #endregion
}
