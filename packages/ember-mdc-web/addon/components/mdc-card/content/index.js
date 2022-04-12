import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { MDCRipple } from '@material/ripple/index';
import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import HeadlineComponent from './../../mdc-headline/index';
import SubheadlineComponent from './../../mdc-sub-headline/index';
import MediaComponent from './media/index';

export default class MdcCardContentComponent extends Component {
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

		this.#mdcRipple = null;
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
			'--mdc-card-content-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-card-content-color');

		// Check if Step 2 is necessary
		if (!this?.args?.palette) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'surface'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'surface'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-card-content-background-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-card-content-color',
			`var(${textColour})`
		);

		// Step 3: Setup / deactivate ripple for primary action
		if (this?.args?.primaryAction) return;

		if (!this.#mdcRipple) return;
		this.#mdcRipple?.deactivate?.();
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get titleComponent() {
		return this?._getComputedSubcomponent?.('title');
	}

	get subtitleComponent() {
		return this?._getComputedSubcomponent?.('subtitle');
	}

	get mediaComponent() {
		return this?._getComputedSubcomponent?.('media');
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
		title: HeadlineComponent,
		subtitle: SubheadlineComponent,
		media: MediaComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-card-content');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
