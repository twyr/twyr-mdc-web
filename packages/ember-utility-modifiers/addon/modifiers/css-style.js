import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';

export default class CSSStyleModifier extends Modifier {
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

	destructor() {
		// this.#debug?.(`destructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	modify(element, positional, named) {
		super.modify?.(...arguments);

		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\npositional: `,
			positional,
			'\ncss properties',
			named
		);

		const elemStyles = Object?.assign?.({}, named);

		const currentProps = Object?.keys?.(this.#cssProps);
		currentProps?.forEach?.((currProp) => {
			if (elemStyles[currProp]) return;
			elemStyles[currProp] = null;
		});

		this.#cssProps = {};
		Object?.keys?.(elemStyles)?.forEach?.((prop) => {
			element.style[prop] = elemStyles[prop];
			if (!elemStyles[prop]) return;

			this.#cssProps[prop] = elemStyles[prop];
		});
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:css-style');
	#cssProps = {};
	// #endregion
}
