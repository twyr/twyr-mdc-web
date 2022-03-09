import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class AlertManagerService extends Service {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);

		this.#queuedAlerts.length = 0;
		this.#snackBars?.clear?.();

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	register(snackbar, controls, register) {
		this.#debug(`register`);

		if (!register) {
			this.#snackBars?.delete?.(snackbar);
			return;
		}

		this.#snackBars?.set?.(snackbar, controls);
	}

	notify(options) {
		this.#debug(`notify: `, options);
		if (!options?.id) {
			this.#debug(`notify: snackbar element id not given. ignoring...`);
			return;
		}

		if (!this.#snackBars?.has?.(options?.id)) {
			this.#debug(`notify: snackbar element id not found. ignoring...`);
			return;
		}

		if (!options?.text) {
			this.#debug(`notify: no text given. ignoring...`);
			return;
		}

		this.#queuedAlerts?.push?.(options);
		this?._showAlert?.();
	}

	notifyActionClose(snackBarId) {
		this.#debug(`notifyActionClose: `, snackBarId);
		if (!snackBarId) {
			this.#debug(
				`notifyActionClose: snackbar element id not given. ignoring...`
			);
			return;
		}

		if (this.#currentAlert?.id === snackBarId) {
			this.#debug(`notifyActionClose: closing current alert`);
			this.#currentAlert = null;
		}

		if (this.#currentAlertTimeout) {
			this.#debug(`notifyActionClose: clearing current timeout`);

			clearTimeout?.(this.#currentAlertTimeout);
			this.#currentAlertTimeout = null;

			this?._showAlert?.();
			return;
		}

		let alertIdx = 0;
		this.#queuedAlerts?.forEach?.((queuedAlert, idx) => {
			if (queuedAlert?.id === snackBarId) alertIdx = idx;
		});

		this.#debug(`notifyActionClose: removing queued alert`);
		this.#queuedAlerts?.splice?.(alertIdx, 1);
	}
	// #endregion

	// #region Private Methods
	_showAlert() {
		this.#debug(`_showAlert`);
		if (this.#currentAlert) {
			this.#debug(
				`_showAlert: current alert already present. ignoring...`
			);
			return;
		}

		this.#currentAlert = this.#queuedAlerts?.shift?.();
		if (!this.#currentAlert) {
			this.#debug(`_showAlert: no more alerts to be shown...`);
			return;
		}

		const timeout = this.#currentAlert?.timeout ?? 5000;
		const snackBar = this.#snackBars?.get?.(this.#currentAlert?.id);

		this.#currentAlert.open = true;
		snackBar?.showAlert?.(this.#currentAlert);

		this.#currentAlertTimeout = setTimeout?.(() => {
			snackBar?.showAlert?.({
				open: false
			});

			this.#currentAlert = null;
			this.#currentAlertTimeout = null;

			this?._showAlert?.();
		}, timeout);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:alert-manager');
	#snackBars = new Map();

	#queuedAlerts = [];
	#currentAlert = null;
	#currentAlertTimeout = null;
	// #endregion
}
