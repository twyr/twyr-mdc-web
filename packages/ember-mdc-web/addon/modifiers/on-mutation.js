import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';

export default class OnMutationModifier extends Modifier {
	// #region Accessed Services
	@service('elementMutationWatcher') mutationWatcher;
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

		this?._manageWatcher?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	didInstall() {
		super.didInstall?.(...arguments);
		this?.modify?.(
			this?.element,
			this?.args?.positional,
			this?.args?.named
		);
	}

	didUpdateArguments() {
		super.didUpdateArguments?.(...arguments);
		this?.modify?.(
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

	modify(element, [callback], named) {
		super.modify?.(...arguments);
		this.#debug?.(
			`modify:\nelement: `,
			element,
			`\ncallback: `,
			callback,
			`\nnamed args: `,
			named
		);

		this?._manageWatcher?.(element, callback, named);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get attributeFilter() {
		return this.#namedArgs?.attributeFilter ?? ['disabled'];
	}

	get attributeOldValue() {
		return !!this.#namedArgs?.attributeOldValue;
	}

	get attributes() {
		return (
			!!this.#namedArgs?.attributes ||
			!!this.#namedArgs?.attributeFilter?.length
		);
	}

	get characterData() {
		return !!this.#namedArgs?.characterData;
	}

	get characterDataOldValue() {
		return !!this.#namedArgs?.characterDataOldValue;
	}

	get childList() {
		return !!this.#namedArgs?.childList;
	}

	get subtree() {
		return !!this.#namedArgs?.subtree;
	}
	// #endregion

	// #region Private Methods
	_manageWatcher(element, callback, named) {
		// Step 1: Get rid of the existing watcher
		if (this.#element && this.#callback) {
			this.#debug?.(`_manageWatcher: de-registering old callback...`);

			this?.mutationWatcher?.unwatchElement?.(
				this.#element,
				this.#callback
			);
		}

		// Step 2: Sanity check
		this.#callback = callback;
		this.#element = element;
		this.#namedArgs = named;

		if (!this.#element) {
			this.#debug?.(`_manageWatcher: no element specified. aborting...`);
			return;
		}

		if (!this.#callback) {
			this.#debug?.(`_manageWatcher: no callback defined. aborting...`);
			return;
		}

		// Step 3: Add new watcher
		const options = {
			attributeFilter: this?.attributeFilter,
			attributeOldValue: this?.attributeOldValue,
			attributes: this?.attributes,
			characterData: this?.characterData,
			characterDataOldValue: this?.characterDataOldValue,
			childList: this?.childList,
			subtree: this?.subtree
		};

		if (!this?.attributes) delete options?.attributeFilter;

		this?.mutationWatcher?.watchElement?.(
			this.#element,
			options,
			this.#callback
		);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:on-mutation');

	#callback = null;
	#element = null;
	#namedArgs = {};
	// #endregion
}
