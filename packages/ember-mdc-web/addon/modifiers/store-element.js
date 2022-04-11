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

	destructor(instance) {
		if (instance) return;
		this.#debug?.(`destructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didInstall() {
		super.didInstall?.(...arguments);
		this?._doModify?.(
			this?.element,
			this?.args?.positional,
			this?.args?.named
		);
	}

	didUpdateArguments() {
		super.didUpdateArguments?.(...arguments);
		this?._doModify?.(
			this?.element,
			this?.args?.positional,
			this?.args?.named
		);
	}

	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.destructor?.();

		super.willDestroy?.(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_doModify(element, [callback], named) {
		// super._doModify?.(...arguments);
		if (this.#element === element && this.#callback === callback) return;

		this.#debug?.(`_doModify:\nelement: `, element);

		this.#element = element;
		this.#callback = callback;

		this.#callback?.(this.#element, named);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:store-element');

	#element = null;
	#callback = null;
	// #endregion
}
