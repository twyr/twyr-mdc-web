import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSnackbarComponent extends Component {
	// #region Accessed Services
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
	// #endregion

	// #region DOM Event Handlers
	@action
	onAction() {
		this.#debug?.(`onAction`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent('action');
		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	onClose() {
		this.#debug?.(`onClose`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent('close');
		this.#element?.dispatchEvent?.(thisEvent);
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

		const thisEvent = new CustomEvent('init', {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					open: this?.open,
					closeable: this?.closeable,
					stacked: this?.stacked
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	storeActionElement(element) {
		MDCRipple?.attachTo?.(element);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	@action
	_showAlert(options) {
		this.#debug?.(`_showAlert: `, options);

		this.open = options?.open ?? false;
		this.stacked = options?.stacked ?? false;
		this.text = options?.text ?? 'Hello, world';
		this.actionLabel = options?.actionLabel ?? null;
		this.closeable = options?.closeable ?? true;

		const thisEvent = new CustomEvent('alert', {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					open: this?.open,
					closeable: this?.closeable,
					stacked: this?.stacked
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-snackbar');

	#element = null;
	#controls = {};
	// #endregion
}
