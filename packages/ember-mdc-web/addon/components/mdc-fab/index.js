import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { MDCRipple } from '@material/ripple/index';

export default class MdcFabComponent extends Component {
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
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		const paletteColour = `--mdc-theme-${
			this?.args?.palette ?? 'secondary'
		}`;
		const textColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'secondary'
		}`;

		this.#element.style.backgroundColor = `var(${paletteColour})`;
		this.#element.style.color = `var(${textColour})`;

		const iconElement = this.#element?.querySelector?.('i.mdc-fab__icon');
		if (iconElement) iconElement.style.color = `var(${textColour})`;

		const labelElement = this.#element?.querySelector?.(
			'span.mdc-fab__label'
		);
		if (labelElement) labelElement.style.color = `var(${textColour})`;

		this.#element?.style?.setProperty?.(
			'--mdc-ripple-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
		MDCRipple?.attachTo?.(this.#element);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-fab');
	#element = null;
	// #endregion
}
