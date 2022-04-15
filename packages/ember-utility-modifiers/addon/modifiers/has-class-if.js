import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';

export default class HasClassIfModifier extends Modifier {
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
	_doModify(element, [condition, positiveClassList, negativeClassList]) {
		// super._doModify?.(...arguments);

		const trueClassList =
			positiveClassList
				?.split?.(' ')
				?.map?.((className) => {
					return className ? className?.trim?.() : null;
				})
				.filter((className) => {
					return !!className && className.length;
				}) ?? [];

		const falseClassList =
			negativeClassList
				?.split?.(' ')
				?.map?.((className) => {
					return className ? className?.trim?.() : null;
				})
				.filter((className) => {
					return !!className && className.length;
				}) ?? [];

		this.#debug?.(
			`_doModify:\nelement: `,
			element,
			`\npositionalArgs::`,
			`${condition}: ${trueClassList?.join?.(
				', '
			)} : ${falseClassList?.join?.(', ')}`
		);

		if (trueClassList?.length) {
			if (condition) element?.classList?.add?.(...trueClassList);
			else element?.classList?.remove?.(...trueClassList);
		}

		if (falseClassList?.length) {
			if (condition) element?.classList?.remove?.(...falseClassList);
			else element?.classList?.add?.(...falseClassList);
		}
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:has-class-if');
	// #endregion
}
