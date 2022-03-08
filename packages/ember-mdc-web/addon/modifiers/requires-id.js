import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { v4 as uuidv4 } from 'uuid';

export default class RequiresIdModifier extends Modifier {
	// #region Accessed Services
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

		this?._setElementId?.();
	}

	didUpdateArguments() {
		super.didUpdateArguments(...arguments);
		this.#debug?.(
			`didUpdateArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		this?._setElementId?.();
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setElementId() {
		const elementId = uuidv4();

		const currentId = this?.element?.getAttribute?.('id');
		if (!currentId) {
			this?.element?.setAttribute?.('id', elementId);
			return;
		}

		const ignore = this?.args?.named?.ignore ?? true;
		if (ignore) return;

		const replace = this?.args?.named?.replace ?? false;
		if (replace) this?.element?.setAttribute?.('id', elementId);

		const append = this?.args?.named?.append ?? false;
		if (append)
			this?.element?.setAttribute?.(
				'id',
				`${[currentId, elementId].join('-')}`
			);

		const prepend = this?.args?.named?.prepend ?? false;
		if (prepend)
			this?.element?.setAttribute?.(
				'id',
				`${[elementId, currentId].join('-')}`
			);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:requires-id');
	// #endregion
}
