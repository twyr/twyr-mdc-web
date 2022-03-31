import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import HeaderComponent from './header/index';
import ContentComponent from './content/index';
import FooterComponent from './footer/index';

export default class MdcDialogComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;
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
	onClickOutside() {
		if (!this?.clickOutsideToClose) {
			this.#debug?.(
				`onClickOutside: ${this?.clickOutsideToClose}. aborting...`
			);
			return;
		}

		this.open = false;
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	positionModal() {
		this.#debug?.(`positionModal`);
		if (!this.#element) return;

		const containerElement = this.#element?.closest?.('div.mdc-dialog');
		if (!containerElement) return;

		containerElement.style.position = this?.args?.parentElement
			? 'absolute'
			: 'fixed';
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this.open = this.#element?.hasAttribute?.('open');
		this?.positionModal?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get fullScreen() {
		return this?.args?.fullScreen ?? false;
	}

	get clickOutsideToClose() {
		return this?.args?.clickOutsideToClose ?? true;
	}

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

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		header: HeaderComponent,
		content: ContentComponent,
		footer: FooterComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-dialog');
	#element = null;
	// #endregion
}
