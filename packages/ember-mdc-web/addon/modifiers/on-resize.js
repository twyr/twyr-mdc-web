import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { inject as service } from '@ember/service';

export default class OnResizeModifier extends Modifier {
	// #region Accessed Services
	@service('elementResizeWatcher') resizeWatcher;
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

		this?.resizeWatcher?.unwatchElement?.(
			this?.element,
			this.#currentCallback
		);

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get resizeBox() {
		return this?.args?.named?.box ?? 'content-box';
	}
	// #endregion

	// #region Private Methods
	_addWatcher() {
		const options = {
			box: this.resizeBox
		};

		if (this.#currentCallback) {
			this.#debug?.(`_addWatcher: de-registering old callback...`);

			this?.mutationWatcher?.unwatchElement(
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
			`_addWatcher:\nelement: `,
			this?.element,
			`\noptions: `,
			options,
			`\ncallback: `,
			this.#currentCallback
		);

		this?.resizeWatcher?.watchElement?.(
			this?.element,
			options,
			this.#currentCallback
		);
	}
	// #endregion

	// #region Private Attributes
	#currentCallback = null;
	#debug = debugLogger('modifier:on-resize');
	// #endregion
}
