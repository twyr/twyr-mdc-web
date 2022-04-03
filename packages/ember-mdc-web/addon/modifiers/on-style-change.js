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
		if (instance) return;
		this.#debug?.(`destructor`);

		this?._manageWatcher?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	didInstall() {
		super.didInstall?.(...arguments);
		this?.modify?.(
			this?.element,
			this?.args?.positional,
			this?.args?.named
		);
	}

	didUpdateArguments() {
		super.didUpdateArguments?.(...arguments);
		this?.modify?.(
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

	modify(element, [callback], { properties }) {
		super.modify?.(...arguments);
		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\ncallback: `,
			callback,
			`\nproperties: `,
			properties
		);

		this?._manageWatcher?.(element, callback, properties);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get options() {
		return this?.args?.named?.styles ?? [];
	}
	// #endregion

	// #region Private Methods
	_manageWatcher(element, callback, properties) {
		// Step 1: Get rid of the existing watcher
		if (this.#element && this.#callback) {
			this.#debug?.(`_manageWatcher: de-registering old callback...`);
			this?.styleWatcher?.unwatchElement?.(this.#element, this.#callback);
		}

		// Step 2: Sanity check
		this.#callback = callback;
		this.#element = element;
		this.#properties = properties;

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
			this.#properties,
			this.#callback
		);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('modifier:on-style-change');

	#callback = null;
	#element = null;
	#properties = {};
	// #endregion
}
