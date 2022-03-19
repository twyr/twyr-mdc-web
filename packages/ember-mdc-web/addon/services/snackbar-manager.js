import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class SnackbarManagerService extends Service {
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

		this.#queuedAlerts?.clear?.();
		this.#snackBars?.clear?.();

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	register(snackbar, controls, register) {
		this.#debug(`register: ${register}`);

		if (!register) {
			this.#snackBars?.delete?.(snackbar);
			return;
		}

		this.#snackBars?.set?.(snackbar, controls);
	}

	notify(options) {
		this.#debug(`notify: `, options);
		if (!options?.snackBarId) {
			options.snackBarId = this.#snackBars?.keys?.()?.next?.()?.value;
		}

		if (!options?.snackBarId) {
			this.#debug(
				`notify: snackbar element id not given, and no element found. ignoring...`
			);
			return;
		}

		if (!this.#snackBars?.has?.(options?.snackBarId)) {
			this.#debug(`notify: snackbar element id not found. ignoring...`);
			return;
		}

		if (!options?.text) {
			this.#debug(`notify: no text given. ignoring...`);
			return;
		}

		if (!this.#queuedAlerts?.has?.(options?.snackBarId)) {
			this.#queuedAlerts?.set?.(options?.snackBarId, []);
		}

		this.#queuedAlerts?.get?.(options?.snackBarId)?.push?.(options);
		this.#debug(
			`notify::queued alert list: `,
			JSON?.stringify?.([...this.#queuedAlerts], null, '\t')
		);

		this?._showAlert?.(options?.snackBarId);
	}

	notifyActionClose(snackBarId) {
		this.#debug(`notifyActionClose: `, snackBarId);
		if (!snackBarId) {
			this.#debug(
				`notifyActionClose: snackbar element id not given. ignoring...`
			);
			return;
		}

		this.#debug(
			`notifyActionClose: clearing current alert in the snackbar`
		);
		this.#currentAlerts[snackBarId] = null;

		this.#debug(`notifyActionClose: displaying next queued alert`);
		this?._showAlert?.(snackBarId);
	}
	// #endregion

	// #region Private Methods
	_showAlert(snackBarId) {
		this.#debug(`_showAlert`);
		if (this.#currentAlerts[snackBarId]) {
			this.#debug(
				`_showAlert: current alert already present for ${snackBarId}. ignoring...`
			);
			return;
		}

		this.#debug(
			`_showAlert::queued alert list: `,
			JSON?.stringify?.([...this.#queuedAlerts], null, '\t')
		);
		let nextAlert = this.#queuedAlerts?.get?.(snackBarId)?.shift?.();
		if (!nextAlert) {
			this.#debug(`_showAlert: no more alerts to be shown...`);
			return;
		}

		this.#debug(`_showAlert: showing next queued alert: `, nextAlert);
		this.#currentAlerts[snackBarId] = nextAlert;

		const snackBar = this.#snackBars?.get?.(snackBarId);
		snackBar?.showAlert?.(nextAlert);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:snackbar-manager');
	#snackBars = new Map();

	#queuedAlerts = new Map();
	#currentAlerts = {};
	// #endregion
}
