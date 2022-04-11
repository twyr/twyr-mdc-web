import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import HeadlineComponent from './../../mdc-headline/index';
import SubHeadlineComponent from './../../mdc-sub-headline/index';

export default class MdcDrawerHeaderComponent extends Component {
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
	// #endregion

	// #region DOM Event Handlers
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.(
			'--mdc-drawer-header-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-drawer-header-color');

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'surface'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'surface'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-drawer-header-background-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-card-header-color',
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

	// #region Modifier Callbacks
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get headlineComponent() {
		return this?._getComputedSubcomponent?.('headline');
	}

	get subHeadlineComponent() {
		return this?._getComputedSubcomponent?.('subheadline');
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
		headline: HeadlineComponent,
		subheadline: SubHeadlineComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-drawer-header');
	#element = null;
	// #endregion
}
