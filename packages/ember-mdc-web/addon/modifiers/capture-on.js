import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';

export default class CaptureOnModifier extends Modifier {
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

		this?._manageEventListener?.();
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
	_doModify(element, [event, eventListener]) {
		// super._doModify?.(...arguments);
		if (this.#event === event && this.#eventHandler === eventListener)
			return;

		this.#debug?.(
			`_doModify:\nelement: `,
			element,
			`\nevent: `,
			event,
			`\neventListener: `,
			eventListener
		);

		this?._manageEventListener?.(event, eventListener);
	}

	_manageEventListener(event, eventListener) {
		if (this.#event && this.#eventHandler)
			document.removeEventListener(
				this.#event,
				this.#eventHandler,
				this.#defaultOptions
			);

		this.#event = event;
		this.#eventHandler = eventListener;

		if (this.#event && this.#eventHandler)
			document.addEventListener(
				this.#event,
				this.#eventHandler,
				this.#defaultOptions
			);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:capture-on');

	#defaultOptions = {
		capture: true,
		passive: false
	};

	#event = null;
	#eventHandler = null;
	// #endregion
}
