import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcDialogComponent extends Component {
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
	onClickOutside(event) {
		const shouldClose = this?.args?.clickOutsideToClose ?? true;
		if (!shouldClose) {
			this.#debug?.(`onClickOutside: ${shouldClose}. aborting...`);
			return;
		}

		const isEventInsideElement =
			event?.target === this.#element ||
			this.#element?.contains?.(event?.target);
		if (isEventInsideElement) {
			this.#debug?.(
				`onClickOutside: click is inside this element. aborting...`
			);
			return;
		}

		this?.args?.onClose?.(event);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	positionModal() {
		this.#debug?.(`positionModal`);
		if (!this.#element) return;

		const containerElement = this.#element?.closest?.('div.mdc-dialog');
		if (!containerElement) return;

		if (this?.args?.parentElement)
			containerElement.style.position = 'absolute';
		else containerElement.style.position = 'fixed';
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.positionModal?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get headerComponent() {
		return this?._getComputedSubcomponent?.('header');
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}

	get footerComponent() {
		return this?._getComputedSubcomponent?.('footer');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		header: 'mdc-dialog/header',
		content: 'mdc-dialog/content',
		footer: 'mdc-dialog/footer'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-dialog');
	#element = null;
	// #endregion
}
