/** Based off of https://github.com/keithclark/ComputedStyleObserver */

import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class ElementComputedStyleWatcherService extends Service {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this?._notifyStyleChange?.();
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		if (this.#checkInterval) {
			clearInterval?.(this.#checkInterval);
			this.#checkInterval = null;
		}

		this.#elementCallback?.clear?.();
		super.willDestroy?.(...arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	watchElement(element, options, callback) {
		this.#debug?.(`watchElement:`, element, options);

		if (!this.#elementCallback?.has?.(element)) {
			const styleAttributes = {};

			styleAttributes['stylesToMonitor'] = new Set(options);
			styleAttributes['currentValues'] = {};
			styleAttributes['callback'] = callback;

			this.#elementCallback?.set?.(element, [styleAttributes]);
			this?._notifyStyleChange?.();

			if (this.#elementCallback?.size === 1) {
				this.#checkInterval = setInterval?.(
					this?._notifyStyleChange?.bind?.(this),
					500
				);
			}

			return;
		}

		const currentElementCallbacks = this.#elementCallback?.get?.(element);

		let currentCallbackRegistered = false;
		for (let idx = 0; idx < currentElementCallbacks?.length; idx++) {
			const styleAttributes = currentElementCallbacks?.[idx];

			if (styleAttributes?.callback === callback) {
				styleAttributes['stylesToMonitor'] = new Set(options);
				styleAttributes['currentValues'] = {};

				currentCallbackRegistered = true;
				break;
			}
		}

		if (currentCallbackRegistered) {
			this?._notifyStyleChange?.();
			return;
		}

		currentElementCallbacks?.push?.({
			stylesToMonitor: new Set(options),
			currentValues: {},
			callback: callback
		});

		this.#elementCallback?.set?.(element, currentElementCallbacks);
		this?._notifyStyleChange?.();
	}

	unwatchElement(element, callback) {
		this.#debug?.(`unwatchElement:`, element);

		if (!callback) {
			this.#debug?.(
				`unwatchElement:`,
				element,
				`callback not passed in. aborting...`
			);
			return;
		}

		let callbackIndex = -1;

		const currentElementCallbacks = this.#elementCallback?.get?.(element);
		for (let idx = 0; idx < currentElementCallbacks?.length; idx++) {
			const styleAttributes = currentElementCallbacks?.[idx];
			if (styleAttributes?.callback === callback) {
				callbackIndex = idx;
				break;
			}
		}

		if (callbackIndex >= 0) {
			currentElementCallbacks?.splice?.(callbackIndex, 1);
			this.#elementCallback?.set?.(element, currentElementCallbacks);

			if (currentElementCallbacks?.length) return;
		}

		this.#debug?.(
			`unwatchElement:`,
			element,
			`last callback removed. unobserving...`
		);

		this.#elementCallback?.delete?.(element);
		if (this.#elementCallback?.size > 0) return;

		if (this.#checkInterval) {
			clearInterval?.(this.#checkInterval);
			this.#checkInterval = null;
		}
	}
	// #endregion

	// #region Private Methods
	_notifyStyleChange() {
		// this.#debug?.(`_notifyStyleChange`);
		if (this.#isCheckRunning) return;

		try {
			this.#isCheckRunning = true;

			this.#elementCallback?.forEach?.(
				(currentElementCallbacks, element) => {
					const elementStyle = window?.getComputedStyle?.(element);

					currentElementCallbacks?.forEach?.((styleAttributes) => {
						const elementChange = {
							element: element
						};

						styleAttributes?.['stylesToMonitor']?.forEach?.(
							(styleProperty) => {
								this.#debug?.(
									`_notifyStyleChange::property::${styleProperty}`,
									element
								);
								if (
									elementStyle?.[styleProperty] ===
									styleAttributes?.['currentValues']?.[
										styleProperty
									]
								)
									return;

								elementChange[styleProperty] = {
									currentValue: elementStyle?.[styleProperty],
									previousValue:
										styleAttributes?.['currentValues']?.[
											styleProperty
										]
								};

								styleAttributes['currentValues'][
									styleProperty
								] = elementStyle?.[styleProperty];
							}
						);

						if (Object?.keys?.(elementChange)?.length <= 1) return;

						this.#debug?.(
							`_notifyStyleChange::elementChange: `,
							elementChange
						);
						styleAttributes?.['callback']?.(elementChange);
					});
				}
			);
		} catch (err) {
			console?.error?.(err);
		} finally {
			this.#isCheckRunning = false;
		}
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('service:element-computed-style-watcher');
	#elementCallback = new Map();

	#checkInterval = null;
	#isCheckRunning = false;
	// #endregion
}
