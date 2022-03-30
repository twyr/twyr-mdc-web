import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';

export default class OnResizeModifier extends Modifier {
	// #region Accessed Services
	@service('elementResizeWatcher') resizeWatcher;
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
		this.#debug?.(`destructor`);
		this?._manageWatcher?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	modify(element, [callback], named) {
		super.modify(...arguments);
		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\ncallback: `,
			callback,
			`\nnamed args: `,
			named
		);

		this?._manageWatcher?.(element, callback, named);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get resizeBox() {
		return this.#namedArgs?.box ?? 'content-box';
	}
	// #endregion

	// #region Private Methods
	_manageWatcher(element, callback, named) {
		// Step 1: Get rid of the existing watcher
		if (this.#element && this.#callback) {
			this.#debug?.(`_manageWatcher: de-registering old callback...`);

			this?.mutationWatcher?.unwatchElement?.(
				this.#element,
				this.#callback
			);
		}

		// Step 2: Sanity check
		this.#callback = callback;
		this.#element = element;
		this.#namedArgs = named;

		if (!this.#element) {
			this.#debug?.(`_manageWatcher: no element specified. aborting...`);
			return;
		}

		if (!this.#callback) {
			this.#debug?.(`_manageWatcher: no callback defined. aborting...`);
			return;
		}

		// Step 3: Add new watcher
		const options = {
			box: this.resizeBox
		};

		this?.resizeWatcher?.watchElement?.(
			this.#element,
			options,
			this.#callback
		);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:on-resize');

	#callback = null;
	#element = null;
	#namedArgs = {};
	// #endregion
}
