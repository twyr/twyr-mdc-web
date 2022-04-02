import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { cancel, later } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSnackbarComponent extends Component {
	// #region Accessed Services
	@service('snackbarManager') snackbarManager;
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;

	@tracked closeable = true;
	@tracked stacked = false;

	@tracked actionLabel = null;
	@tracked text = 'Hello, world';
	// #endregion

	// #region Untracked Public Fields
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

		this?.snackbarManager?.register?.(this.#element?.id, null, false);

		if (this.#alertTimeout) {
			cancel?.(this.#alertTimeout);
			this.#alertTimeout = null;
		}

		this.#actionHandler = null;
		this.#closeHandler = null;

		this.#mdcActionRipple = null;
		this.#mdcRipple = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	async fireActionEvent(action) {
		this.#debug?.(`fireActionEvent: ${action}`);
		if (!this.#element) return;

		this.open = false;

		if (this.#alertTimeout) {
			cancel(this.#alertTimeout);
			this.#alertTimeout = null;
		}

		if (action == 'action') {
			await this.#actionHandler?.();
		}

		if (action === 'close') {
			await this.#closeHandler?.();
		}

		this.#actionHandler = null;
		this.#closeHandler = null;

		this?.snackbarManager?.notifyActionClose?.(this.#element?.id);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.('--mdc-snackbar-action-color');

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
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
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcStyles?.();

		this?.snackbarManager?.register?.(
			this.#element?.id,
			this.#controls,
			true
		);
	}

	@action
	storeActionElement(element) {
		this.#debug?.(`storeActionElement: `, element);
		this.#mdcActionRipple = new MDCRipple(element);

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	@action
	_showAlert(options) {
		this.#debug?.(`_showAlert: `, options);
		if (this.#alertTimeout) {
			cancel?.(this.#alertTimeout);
			this.#alertTimeout = null;
		}

		this.actionLabel = options?.actionLabel ?? null;
		this.text = options?.text ?? 'Hello, world';

		this.closeable = options?.closeable ?? true;
		this.stacked = options?.stacked ?? false;

		this.#actionHandler = options?.actionHandler ?? null;
		this.#closeHandler = options?.closeHandler ?? null;

		this.open = options?.open ?? false;

		this?._setComponentState?.();
		this?.recalcStyles?.();

		if (this.open) {
			const timeout = options?.timeout ?? 5000;
			this.#alertTimeout = later?.(
				this,
				this?.fireActionEvent,
				'close',
				timeout
			);
		}
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	_setComponentState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcActionRipple?.deactivate?.();
			this.#mdcRipple?.deactivate?.();
		} else {
			// this.#mdcRipple?.activate?.();
			// this.#mdcActionRipple?.activate?.();
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-snackbar');
	#controls = {};

	#element = null;
	#mdcRipple = null;
	#mdcActionRipple = null;

	#alertTimeout = null;

	#actionHandler = null;
	#closeHandler = null;
	// #endregion
}
