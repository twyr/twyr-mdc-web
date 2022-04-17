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
		// this.#debug?.(`destructor`);
		instance?._manageEventListener?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	modify(element, [event, eventListener], { passive }) {
		super.modify?.(...arguments);
		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\nevent: `,
			event,
			`\neventListener: `,
			eventListener
		);

		this?._manageEventListener?.(element, event, eventListener, passive);
	}
	// #endregion

	// #region DOM Event Handlers
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

	// #region Computed Properties
	// #endregion

	// #region Private Methods
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
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:not-on');

	#element = null;
	#event = null;
	#eventHandler = null;
	#passive = false;
	// #endregion
}
