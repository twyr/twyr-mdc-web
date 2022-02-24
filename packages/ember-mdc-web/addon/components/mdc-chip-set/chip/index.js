import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

import { MDCRipple } from '@material/ripple/index';

export default class MdcChipsetChipComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	onPrimaryAction(event) {
		this.#debug?.(`onPrimaryAction:`, event);
		if (!this.#primaryActionElement) return;

		const thisEvent = new CustomEvent('action', {
			detail: {
				id: this.#element?.getAttribute?.('id')
			}
		});

		this.#primaryActionElement?.dispatchEvent?.(thisEvent);
	}

	@action
	onClickToClose(event) {
		this.#debug?.(`onClickToClose:`, event);
		if (!this.#primaryActionElement) return;

		const thisEvent = new CustomEvent('close', {
			detail: {
				id: this.#element?.getAttribute?.('id')
			}
		});

		this.#primaryActionElement?.dispatchEvent?.(thisEvent);
	}

	@action
	onAttributeMutation(mutationEntry) {
		this.#debug?.(`onAttributeMutation:`, mutationEntry);
		if (!this.#element) return;

		if (mutationEntry?.target?.disabled)
			this.#element?.classList?.add?.('mdc-evolution-chip--disabled');
		else this.#element?.classList?.remove?.('mdc-evolution-chip--disabled');

		this?.recalcStyle?.();
	}

	@action
	recalcStyle() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		this.#element?.style?.removeProperty?.(
			'--mdc-evolution-chip-ripple-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-evolution-chip-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-evolution-chip-color');

		if (
			this.#element?.classList?.contains?.('mdc-evolution-chip--disabled')
		)
			return;

		if (!this?.args?.palette) return;

		const paletteColour = `--mdc-theme-${
			this?.args?.palette ?? 'secondary'
		}`;
		const textColour = `--mdc-theme-on-${
			this?.args?.palette ?? 'secondary'
		}`;

		this.#element?.style?.setProperty?.(
			'--mdc-evolution-chip-ripple-color',
			`var(${textColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-evolution-chip-background-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-evolution-chip-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyle?.();
	}

	@action
	storePrimaryActionElement(actionElement) {
		this.#debug(`storePrimaryActionElement: `, actionElement);
		this.#primaryActionElement = actionElement;

		MDCRipple?.attachTo?.(this.#primaryActionElement);
	}
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
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-chip-set-chip');
	#element = null;
	#primaryActionElement = null;
	// #endregion
}
