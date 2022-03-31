import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { MDCRipple } from '@material/ripple/index';
import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import ListItemIconComponent from './icon/index';

export default class MdcListItemComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked disabled = false;
	@tracked selected = false;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.select = this?._select;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.args?.listControls?.registerItem?.(this.#element, null, false);

		this.#mdcRipple = null;
		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick() {
		this?.args?.listControls?.selectItem?.(this.#element, !this?.selected);
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
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcStyles?.();

		this?.args?.listControls?.registerItem?.(
			this.#element,
			this.#controls,
			true
		);

		if (!this.#element?.hasAttribute?.('selected')) return;
		this?.args?.listControls?.selectItem?.(this.#element, true);
	}
	// #endregion

	// #region Controls
	@action
	_select(selected) {
		this.#debug?.(`_select: `, selected);
		this.selected = selected;
	}
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

	_setComponentState() {
		this.#debug?.(
			`__setComponentState::disabled: ${this.#element?.hasAttribute?.(
				'disabled'
			)}`
		);
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#element?.classList?.add?.('mdc-list-item--disabled');
			this.disabled = true;

			return;
		}

		this.#element?.classList?.remove?.('mdc-list-item--disabled');
		this.disabled = false;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		icon: ListItemIconComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-list-item');
	#controls = {};

	#element = null;
	#mdcRipple = null;
	// #endregion
}
