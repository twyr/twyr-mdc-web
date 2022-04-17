import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';

export default class OnStyleChangeModifier extends Modifier {
	// #region Accessed Services
	@service('elementComputedStyleWatcher') styleWatcher;
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
		instance?._manageWatcher?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	modify(element, [callback], { styles }) {
		super.modify?.(...arguments);
		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\ncallback: `,
			callback,
			`\nstyles: `,
			styles
		);

		this?._manageWatcher?.(element, callback, styles);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_manageWatcher(element, callback, styles) {
		// Step 1: Get rid of the existing watcher
		if (this.#element && this.#callback) {
			this.#debug?.(`_manageWatcher: de-registering old callback...`);
			this?.styleWatcher?.unwatchElement?.(this.#element, this.#callback);
		}

		// Step 2: Sanity check
		this.#callback = callback;
		this.#element = element;

		if (!this.#element) {
			this.#debug?.(`_manageWatcher: no element specified. aborting...`);
			return;
		}

		if (!this.#callback) {
			this.#debug?.(`_manageWatcher: no callback defined. aborting...`);
			return;
		}

		this?.styleWatcher?.watchElement?.(
			this.#element,
			styles,
			this.#callback
		);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('modifier:on-style-change');

	#callback = null;
	#element = null;
	// #endregion
}
