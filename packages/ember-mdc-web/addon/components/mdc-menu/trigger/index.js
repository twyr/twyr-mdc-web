import Component from './../../mdc-abstract-dropdown/trigger/index';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import IconComponent from './../icon/index';

export default class MdcMenuTriggerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onTriggerEvent(event) {
		this.#debug?.(`onTriggerEvent::${this?.triggerEvent} `, event);
		this?.args?.dropdownControls?.open?.();
	}

	@action
	notOnClick(event) {
		this.#debug(`notOnClick: `, event);
		if (!this.#element) return;

		if (!this?.open) return;
		this?.args?.dropdownControls?.close?.();
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles`);
		if (!this.#element) return;

		const textElement = this.#element?.querySelector?.(
			'span.mdc-list-item__text'
		);

		const primaryTextElement = this.#element?.querySelector?.(
			'span.mdc-list-item__primary-text'
		);

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario
		this.#element?.style?.removeProperty?.('--mdc-ripple-color');

		this.#element.style.borderRadius = null;
		if (textElement) textElement.style.color = null;
		if (primaryTextElement) primaryTextElement.style.color = null;

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
		if (this?.args?.shaped) {
			this.#element.style.borderRadius = '0 2rem 2rem 0';
		}

		if (this?.args?.palette) {
			this.#element?.style?.setProperty?.(
				'--mdc-ripple-color',
				`var(--mdc-theme-${this?.args?.palette})`
			);

			if (textElement)
				textElement.style.color = `var(--mdc-theme-${this?.args?.palette})`;

			if (primaryTextElement)
				primaryTextElement.style.color = `var(--mdc-theme-${this?.args?.palette})`;
		}
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get iconComponent() {
		return this?._getComputedSubcomponent?.('icon');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		icon: IconComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu-trigger');
	#element = null;
	// #endregion
}
