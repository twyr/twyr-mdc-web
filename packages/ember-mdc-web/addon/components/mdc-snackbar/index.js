import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSnackbarComponent extends Component {
	// #region Accessed Services
	@service('alertManager') alertManager;
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;
	@tracked stacked = false;
	@tracked text = 'Hello, world';
	@tracked actionLabel = null;
	@tracked closeable = true;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.showAlert = this._showAlert;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this?.alertManager?.register(
			this.#element?.getAttribute?.('id'),
			null,
			false
		);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onAction() {
		this.#debug?.(`onAction`);
		if (!this.#element) return;

		if (this.#alertTimeout) {
			clearTimeout(this.#alertTimeout);
			this.#alertTimeout = null;
		}

		this.open = false;
		this?.alertManager?.notifyActionClose?.(
			this.#element?.getAttribute?.('id')
		);

		this?._fireEvent?.('action');
	}

	@action
	onClose() {
		this.#debug?.(`onClose`);
		if (!this.#element) return;

		if (this.#alertTimeout) {
			clearTimeout(this.#alertTimeout);
			this.#alertTimeout = null;
		}

		this.open = false;
		this?.alertManager?.notifyActionClose?.(
			this.#element?.getAttribute?.('id')
		);

		this?._fireEvent?.('close');
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		this.#element?.style?.removeProperty?.('--mdc-snackbar-action-color');

		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;
		this.#element?.style?.setProperty?.(
			'--mdc-snackbar-action-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
		this?._fireEvent?.('init');

		this?.alertManager?.register(
			this.#element?.getAttribute?.('id'),
			this.#controls,
			true
		);
	}

	@action
	storeActionElement(element) {
		this.#debug?.(`storeActionElement: `, element);
		MDCRipple?.attachTo?.(element);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	@action
	_fireEvent(name) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				snackBarId: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					open: this?.open,
					closeable: this?.closeable,
					stacked: this?.stacked,
					actionLabel: this?.actionLabel
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	_showAlert(options) {
		this.#debug?.(`_showAlert: `, options);
		if (this.#alertTimeout) {
			this?.onClose?.();
		}

		let shouldFire = false;

		if (this?.open !== options?.open) {
			this.open = options?.open ?? false;
			shouldFire ||= true;
		}

		if (this?.stacked !== options?.stacked) {
			this.stacked = options?.stacked ?? false;
			shouldFire ||= true;
		}

		if (this?.text !== options?.text) {
			this.text = options?.text ?? 'Hello, world';
			shouldFire ||= true;
		}

		if (this?.actionLabel !== options?.actionLabel) {
			this.actionLabel = options?.actionLabel ?? null;
			shouldFire ||= true;
		}

		if (this?.closeable !== options?.closeable) {
			this.closeable = options?.closeable ?? true;
			shouldFire ||= true;
		}

		if (!shouldFire) return;
		this?._fireEvent?.('alert');

		if (this.open) {
			const timeout = options?.timeout ?? 5000;
			// TODO: Replace with run.later...
			this.#alertTimeout = setTimeout?.(this?.onClose, timeout);
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-snackbar');

	#element = null;
	#controls = {};

	#alertTimeout = null;
	// #endregion
}
