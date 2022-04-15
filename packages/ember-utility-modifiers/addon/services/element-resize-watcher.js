import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class ElementResizeWatcherService extends Service {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#observer = new ResizeObserver(this?._notifyResize?.bind?.(this));
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
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
		this.#debug?.(`watchElement:`, element, options);
		if (!this.#observer) return;

		if (!this.#elementCallback?.has?.(element)) {
			this.#elementCallback?.set?.(element, [callback]);
			this.#observer?.observe?.(element, options);

			return;
		}

		const currentElementCallbacks = this.#elementCallback?.get?.(element);
		if (!currentElementCallbacks) {
			this.#elementCallback?.set?.(element, [callback]);
			return;
		}

		currentElementCallbacks?.push?.(callback);
	}

	unwatchElement(element, callback) {
		this.#debug?.(`unwatchElement:`, element);
		if (!this.#observer) return;

		if (!callback) {
			this.#debug?.(
				`unwatchElement:`,
				element,
				`callback not passed in. aborting...`
			);
			return;
		}

		const currentElementCallbacks = this.#elementCallback?.get?.(element);
		if (!currentElementCallbacks) return;

		const callbackIndex = currentElementCallbacks?.indexOf?.(callback);
		if (callbackIndex >= 0) {
			currentElementCallbacks?.splice?.(callbackIndex, 1);
			if (currentElementCallbacks?.length) return;
		}

		this.#debug?.(
			`unwatchElement:`,
			element,
			`last callback removed. unobserving...`
		);

		this.#observer?.unobserve?.(element);
		this.#elementCallback?.delete?.(element);
	}
	// #endregion

	// #region Private Methods
	_notifyResize(entries) {
		this.#debug?.(`_notifyResize:`, entries);
		entries.forEach((entry) => {
			const element = entry?.target;
			if (!element) return;

			const callbacks = this.#elementCallback?.get?.(element);
			if (!callbacks) return;

			callbacks?.forEach?.((callback) => {
				callback?.(entry);
			});
		});
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:element-resize-watcher');
	#observer = null;

	#elementCallback = new Map();
	// #endregion
}