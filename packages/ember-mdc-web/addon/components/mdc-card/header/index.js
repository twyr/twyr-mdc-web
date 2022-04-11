import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import HeadlineComponent from './../../mdc-headline/index';
import SubheadlineComponent from './../../mdc-sub-headline/index';

export default class MdcCardHeaderComponent extends Component {
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
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.(
			'--mdc-card-header-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-card-header-color');

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'surface'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'surface'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-card-header-background-color',
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
		subheadline: SubheadlineComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-header');
	#element = null;
	// #endregion
}
