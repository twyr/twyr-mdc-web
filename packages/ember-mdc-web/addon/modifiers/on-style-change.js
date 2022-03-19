import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { service } from '@ember/service';

export default class OnStyleChangeModifier extends Modifier {
	// #region Accessed Services
	@service('elementComputedStyleWatcher') styleWatcher;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didInstall() {
		super.didInstall(...arguments);
		this.#debug?.(
			`didInstall:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		this?._addWatcher?.();
	}

	didUpdateArguments() {
		super.didUpdateArguments(...arguments);
		this.#debug?.(
			`didUpdateArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		this?._addWatcher?.();
	}

	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?.styleWatcher?.unwatchElement?.(
			this?.element,
			this.#currentCallback
		);

		super.willDestroy?.(...arguments);
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
	_addWatcher() {
		if (this.#currentCallback) {
			this.#debug?.(`_addWatcher: de-registering old callback...`);
			this?.styleWatcher?.unwatchElement?.(
				this?.element,
				this.#currentCallback
			);
		}

		this.#currentCallback = this?.args?.positional?.[0];
		if (!this.#currentCallback) {
			this.#debug?.(`_addWatcher: no callback defined. aborting...`);
			return;
		}

		this.#debug?.(
			`didReceiveArguments:\nelement: `,
			this?.element,
			`\noptions: `,
			this?.options,
			`\ncallback: `,
			this.#currentCallback
		);

		this?.styleWatcher?.watchElement?.(
			this?.element,
			this?.options,
			this.#currentCallback
		);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('modifier:on-style-change');
	#currentCallback = null;
	// #endregion
}
