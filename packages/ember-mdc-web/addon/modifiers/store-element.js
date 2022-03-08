import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

export default class StoreElementModifier extends Modifier {
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

		this.#element = this?.element;
		this.#args = this?.args;

		this?._storeElement?.();
	}

	didUpdateArguments() {
		super.didUpdateArguments(...arguments);
		this.#debug?.(
			`didUpdateArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		if (!this?._shouldFire?.()) {
			this.#debug?.('didUpdateArguments: no args change. aborting...');
			return;
		}

		this?._storeElement?.();
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_storeElement() {
		const storeFunc = this?.args?.positional?.[0];
		storeFunc?.(this?.element, this?.args?.positional?.[1]);
	}

	_shouldFire() {
		if (this.#element !== this?.element) {
			this.#debug?.(`_shouldFire: element has changed. firing...`);
			this.#element = this.element;
			return true;
		}

		if ((!this.#args && !!this?.args) || (!!this.#args && !this?.args)) {
			this.#debug?.(`_shouldFire: args have changed. firing...`);
			this.#args = this?.args;
			return true;
		}

		if (this?.args?.positional?.length !== this.#args?.positional?.length) {
			this.#debug?.(
				`_shouldFire: positional args length changed. firing...`
			);
			this.#args = this?.args;
			return true;
		}

		if (
			Object?.keys?.(this.#args?.named)?.length !==
			Object?.keys?.(this?.args?.named)?.length
		) {
			this.#debug?.(`_shouldFire: named args length changed. firing...`);
			this.#args = this?.args;
			return true;
		}

		let shouldFire = false;

		this.#debug?.(`_shouldFire: checking positional args values...`);
		this?.args?.positional?.forEach?.((posArg, idx) => {
			this.#debug?.(
				`_shouldFire: args.positional[${idx}]: ${posArg} vs ${
					this.#args?.positional?.[idx]
				}`
			);
			if (posArg !== this.#args?.positional?.[idx]) {
				this.#debug?.(
					`_shouldFire: args.positional[${idx}]::${posArg} changed. firing...`
				);
				this.#args.positional[idx] = posArg;
				shouldFire ||= true;
			}
		});

		this.#debug?.(`_shouldFire: checking named args values...`);
		Object?.keys?.(this?.args?.named ?? {})?.forEach?.((key) => {
			this.#debug?.(
				`_shouldFire: args.named[${key}]: ${
					this?.args?.named?.[key]
				} vs ${this.#args?.named?.[key]}`
			);
			if (this?.args?.named?.[key] !== this.#args?.named?.[key]) {
				this.#debug?.(
					`_shouldFire: args.named[${key}]::${this?.args?.named?.[key]} changed. firing...`
				);
				this.#args.named[key] = this?.args?.named?.[key];
				if (!this.#args?.named?.[key]) delete this.#args?.named?.[key];

				shouldFire ||= true;
			}
		});

		Object?.keys?.(this.#args?.named ?? {})?.forEach?.((key) => {
			this.#debug?.(
				`_shouldFire: args.named[${key}]: ${
					this?.args?.named?.[key]
				} vs ${this.#args?.named?.[key]}`
			);
			if (this?.args?.named?.[key] !== this.#args?.named?.[key]) {
				this.#debug?.(
					`_shouldFire: args.named[${key}]::${this?.args?.named?.[key]} changed. firing...`
				);
				this.#args.named[key] = this?.args?.named?.[key];
				if (!this.#args?.named?.[key]) delete this.#args?.named?.[key];

				shouldFire ||= true;
			}
		});

		this.#debug?.(`_shouldFire: ${shouldFire}`);
		return shouldFire;
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:store-element');

	#element = null;
	#args = null;
	// #endregion
}
