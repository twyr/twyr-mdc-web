import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

import { inject as service } from '@ember/service';

export default class OnMutationModifier extends Modifier {
	// #region Accessed Services
	@service('elementMutationWatcher') mutationWatcher;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didReceiveArguments() {
		super.didReceiveArguments(...arguments);

		const options = {
			attributeFilter: this.attributeFilter,
			attributeOldValue: this.attributeOldValue,
			attributes: this.attributes,
			characterData: this.characterData,
			characterDataOldValue: this.characterDataOldValue,
			childList: this.childList,
			subtree: this.subtree
		};

		if (!this?.attributes) delete options?.attributeFilter;

		if (this.#currentCallback) {
			this.#debug?.(
				`didReceiveArguments: de-registering old callback...`
			);
			this?.mutationWatcher?.unwatchElement(
				this?.element,
				this.#currentCallback
			);
		}

		this.#currentCallback = this?.args?.positional?.[0];
		if (!this.#currentCallback) {
			this.#debug?.(
				`didReceiveArguments: no callback defined. aborting...`
			);
			return;
		}

		this.#debug?.(
			`didReceiveArguments:\nelement: `,
			this?.element,
			`\noptions: `,
			options,
			`\ncallback: `,
			this.#currentCallback
		);
		this?.mutationWatcher?.watchElement(
			this?.element,
			options,
			this.#currentCallback
		);
	}

	willDestroy() {
		this.#debug?.(`willDestroy`);
		super.willDestroy(...arguments);

		this?.mutationWatcher?.unwatchElement(
			this?.element,
			this.#currentCallback
		);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	get attributeFilter() {
		return this?.args?.named?.attributeFilter ?? ['disabled'];
	}

	get attributeOldValue() {
		return !!this?.args?.named?.attributeOldValue;
	}

	get attributes() {
		return (
			!!this?.args?.named?.attributes ||
			!!this?.args?.named?.attributeFilter?.length
		);
	}

	get characterData() {
		return !!this?.args?.named?.characterData;
	}

	get characterDataOldValue() {
		return !!this?.args?.named?.characterDataOldValue;
	}

	get childList() {
		return !!this?.args?.named?.childList;
	}

	get subtree() {
		return !!this?.args?.named?.subtree;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#currentCallback = null;
	#debug = debugLogger('modifier:on-mutation');
	// #endregion
}
