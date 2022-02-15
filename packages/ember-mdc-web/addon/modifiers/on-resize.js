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
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didReceiveArguments() {
		super.didReceiveArguments(...arguments);

		const options = {
			box: this.resizeBox
		};

		if (this.#currentCallback) {
			this.#debug(`didReceiveArguments: de-registering old callback...`);
			this?.mutationWatcher?.unwatchElement(
				this?.element,
				this.#currentCallback
			);
		}

		this.#currentCallback = this?.args?.positional?.[0];
		if (!this.#currentCallback) {
			this.#debug(
				`didReceiveArguments: no callback defined. aborting...`
			);
			return;
		}

		this.#debug(
			`didReceiveArguments:\nelement: `,
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

	willDestroy() {
		this.#debug(`willDestroy`);
		super.willDestroy(...arguments);

		this?.resizeWatcher?.unwatchElement?.(
			this?.element,
			this.#currentCallback
		);
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
	// #endregion

	// #region Private Attributes
	#currentCallback = null;
	#debug = debugLogger('modifier:on-resize');
	// #endregion
}
