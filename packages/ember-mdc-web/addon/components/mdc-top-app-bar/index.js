import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ActionIconComponent from './action-icon/index';
import NavigationIconComponent from './navigation-icon/index';

export default class MdcTopAppBarComponent extends Component {
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
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.(
			'--mdc-top-app-bar-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-top-app-bar-color');

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-top-app-bar-background-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-top-app-bar-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get navigationIconComponent() {
		return this?._getComputedSubcomponent?.('navigationIcon');
	}

	get actionIconComponent() {
		return this?._getComputedSubcomponent?.('actionIcon');
	}
	// #endregion

	// #region Private Methods
	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// //#endregion

	// #region Default Sub-components
	#subComponents = {
		navigationIcon: NavigationIconComponent,
		actionIcon: ActionIconComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('component:mdc-top-app-bar');
	#element = null;
	// #endregion
}
