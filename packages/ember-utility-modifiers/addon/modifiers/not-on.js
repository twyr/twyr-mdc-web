import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import supportsPassiveEventListeners from './../utils/check-browser-features';

import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';

export default class NotOnModifier extends Modifier {
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

		registerDestructor(this, this?.destructor);
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
	_doModify(element, [event, eventListener], { passive }) {
		// super._doModify?.(...arguments);
		this.#debug?.(
			`_doModify:\nelement: `,
			element,
			`\nevent: `,
			event,
			`\neventListener: `,
			eventListener
		);

		this?._manageEventListener?.(element, event, eventListener, passive);
	}

	_manageEventListener(element, event, eventListener, passive = false) {
		if (this.#event && this.#eventHandler)
			document.removeEventListener(this.#event, this?._eventHandler, {
				capture: false,
				passive: this.#passive
			});

		this.#element = element;
		this.#event = event;
		this.#eventHandler = eventListener;
		this.#passive = supportsPassiveEventListeners && passive;

		if (this.#event && this.#eventHandler)
			document.addEventListener(this.#event, this?._eventHandler, {
				capture: false,
				passive: this.#passive
			});
	}

	@action
	_eventHandler(event) {
		const isEventOutsideElement =
			event.target !== this.#element &&
			!this.#element.contains(event.target);

		this.#debug?.(
			`_eventHandler:\nelement: `,
			this.#element,
			`\nevent: `,
			this.#event,
			`\noutside? `,
			isEventOutsideElement
		);

		if (!isEventOutsideElement) return;

		this.#eventHandler?.(event);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:not-on');

	#element = null;
	#event = null;
	#eventHandler = null;
	#passive = false;
	// #endregion
}