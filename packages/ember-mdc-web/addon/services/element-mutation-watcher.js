import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class ElementMutationWatcherService extends Service {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);

		this.#observer = new MutationObserver(
			this?._notifyMutation?.bind?.(this)
		);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);
		super.willDestroy(...arguments);

		this.#elementCallback?.clear?.();
		if (!this.#observer) return;

		this.#observer.disconnect();
		this.#observer = null;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	watchElement(element, options, callback) {
		this.#debug(`watchElement:`, element, options);
		if (!this.#observer) return;

		if (!this.#elementCallback?.has?.(element))
			this.#observer?.observe?.(element, options);

		const currentElementCallbacks = this.#elementCallback?.get?.(element);
		if (!currentElementCallbacks)
			this.#elementCallback?.set?.(element, [callback]);
		else currentElementCallbacks?.push?.(callback);
	}

	unwatchElement(element, callback) {
		this.#debug(`unwatchElement:`, element);
		if (!this.#observer) return;

		if (!callback) {
			this.#debug(
				`unwatchElement:`,
				element,
				`callback not passed in. aborting...`
			);
			return;
		}

		const currentElementCallbacks = this.#elementCallback?.get?.(element);
		const callbackIndex = currentElementCallbacks?.indexOf?.(callback);
		if (callbackIndex < 0) {
			this.#debug(
				`unwatchElement:`,
				element,
				`callback not registered. aborting...`
			);
			return;
		}

		currentElementCallbacks?.splice?.(callbackIndex, 1);
		if (currentElementCallbacks?.length) return;

		this.#debug(
			`unwatchElement:`,
			element,
			`last callback removed. unobserving...`
		);
		this.#observer?.unobserve?.(element);
		this.#elementCallback?.delete?.(element);
	}
	// #endregion

	// #region Private Methods
	_notifyMutation(entries) {
		this.#debug(`_notifyMutation:`, entries);
		entries?.forEach?.((entry) => {
			this.#debug(
				`_notifyMutation::processing mutation entry:`,
				JSON.stringify(entry, null, '\t')
			);

			const element = entry?.target;
			if (!element) {
				this.#debug(
					`_notifyMutation::target element not found. aborting...`
				);
				return;
			}

			this.#debug(`_notifyMutation::target element:`, element);
			const callbacks = this.#elementCallback?.get?.(element);
			if (!callbacks) {
				this.#debug(
					`_notifyMutation::target element callback not found. aborting...`
				);
				return;
			}

			callbacks?.forEach?.((callback) => {
				callback?.(entry);
			});
		});
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:element-mutation-watcher');
	#observer = null;

	#elementCallback = new Map();
	// #endregion
}
