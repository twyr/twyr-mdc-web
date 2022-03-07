import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { MDCRipple } from '@material/ripple/index';

export default class MdcSnackbarComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
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

		MDCRipple?.attachTo?.(this.#element);
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-snackbar');
	#element = null;
	// #endregion
}
