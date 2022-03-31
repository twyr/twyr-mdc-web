import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { MDCRipple } from '@material/ripple/index';
import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import IconComponent from './../icon/index';

export default class MdcMenuItemComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked disabled = false;
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

		this.#mdcRipple = null;
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setupInitState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles`);
		if (!this.#element) return;

		const textElement = this.#element?.querySelector?.(
			'span.mdc-list-item__text'
		);

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario
		this.#element?.style?.removeProperty?.('--mdc-ripple-color');

		this.#element.style.borderRadius = null;
		if (textElement) textElement.style.color = null;

		// Stop if the element is disabled
		if (this.#element?.hasAttribute?.('disabled')) return;

		// Step 2: Style / Palette
		if (this?.args?.palette) {
			this.#element?.style?.setProperty?.(
				'--mdc-ripple-color',
				`var(--mdc-theme-${this?.args?.palette})`
			);

			if (textElement)
				textElement.style.color = `var(--mdc-theme-${this?.args?.palette})`;
		}
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setupInitState?.();
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
	_setupInitState() {
		this.#debug?.(
			`__setupInitState::disabled: ${this.#element?.hasAttribute?.(
				'disabled'
			)}`
		);
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.disabled = true;
		} else {
			// this.#mdcRipple?.activate?.();
			this.disabled = false;
		}
	}

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
	#debug = debugLogger('component:mdc-menu-item');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
