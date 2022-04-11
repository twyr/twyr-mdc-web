import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';
import { v4 as uuidv4 } from 'uuid';

export default class RequiresIdModifier extends Modifier {
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
	_doModify(element, positional, named) {
		// super._doModify?.(...arguments);
		this.#debug?.(
			`_doModify:\nelement: `,
			element,
			'\npositional args: ',
			positional,
			`\nnamed args: `,
			named
		);

		this?._setElementId?.(element, named);
	}

	_setElementId(element, { ignore, replace, append, prepend }) {
		const elementId = uuidv4();

		const currentId = element?.getAttribute?.('id');
		if (!currentId) {
			element?.setAttribute?.('id', elementId);
			return;
		}

		if (ignore) return;

		if (replace) {
			element?.setAttribute?.('id', elementId);
			return;
		}

		if (append) element?.setAttribute?.('id', `${currentId}-${elementId}`);

		if (prepend) element?.setAttribute?.('id', `${elementId}-${currentId}`);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:requires-id');
	// #endregion
}
