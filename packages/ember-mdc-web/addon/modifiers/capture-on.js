import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

export default class CaptureOnModifier extends Modifier {
	// #region Accessed Services
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
		this.#debug(
			`didReceiveArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		// eslint-disable-next-line curly
		if (this.#event && this.#eventHandler) {
			document.removeEventListener(
				this.#event,
				this?._eventHandler?.bind?.(this),
				this.#defaultOptions
			);
		}

		this.#event = this?.args?.positional?.[0];
		this.#eventHandler = this?.args?.positional?.[1];

		document.addEventListener(
			this.#event,
			this?._eventHandler?.bind?.(this),
			this.#defaultOptions
		);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_eventHandler(event) {
		const isEventOutsideElement =
			event.target !== this.element &&
			!this.element.contains(event.target);

		this.#debug(
			`_eventHandler:\nelement: `,
			this?.element,
			`\nevent: `,
			this.#event,
			`\noutside? `,
			isEventOutsideElement
		);

		if (isEventOutsideElement) return;

		this.#eventHandler?.(event);
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
