import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

import { MDCRipple } from '@material/ripple/index';

export default class MdcChipsetChipComponent extends Component {
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
	@action
	onClickToClose(event) {
		this.#debug?.(`onClickToClose: `, event);
		if (!this.#element) return;

		this?._fireEvent?.('close');
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationEntry) {
		this.#debug?.(`onAttributeMutation: `, mutationEntry);
		if (!this.#element) return;

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		const rootElement = this.#element?.closest?.('span.mdc-evolution-chip');
		if (!rootElement) {
			this.#debug?.(`recalcStyles: root element not found... aborting`);
			return;
		}

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		rootElement?.style?.removeProperty?.(
			'--mdc-evolution-chip-ripple-color'
		);
		rootElement?.style?.removeProperty?.(
			'--mdc-evolution-chip-background-color'
		);
		rootElement?.style?.removeProperty?.('--mdc-evolution-chip-color');

		// Stop if the element is disabled
		if (rootElement?.classList?.contains?.('mdc-evolution-chip--disabled'))
			return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${
			this?.args?.palette ?? 'secondary'
		}`;
		const textColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'secondary'
		}`;

		rootElement?.style?.setProperty?.(
			'--mdc-evolution-chip-ripple-color',
			`var(${textColour})`
		);
		rootElement?.style?.setProperty?.(
			'--mdc-evolution-chip-background-color',
			`var(${paletteColour})`
		);
		rootElement?.style?.setProperty?.(
			'--mdc-evolution-chip-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setComponentState?.();
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get primaryActionRole() {
		return this?.args?.role === 'row' ? 'gridcell' : 'option';
	}

	get trailingActionRole() {
		return 'gridcell';
	}
	// #endregion

	// #region Private Methods
	_fireEvent(name) {
		this.#debug?.(`_fireEvent: ${name}`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name);
		this.#element?.dispatchEvent?.(thisEvent);
	}

	_setComponentState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			this.#element
				?.closest?.('span.mdc-evolution-chip')
				?.classList?.add?.('mdc-evolution-chip--disabled');

			return;
		}

		this.#element
			?.closest?.('span.mdc-evolution-chip')
			?.classList?.remove?.('mdc-evolution-chip--disabled');
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-chip-set-chip');

	#element = null;
	#mdcRipple = null;
	// #endregion
}
