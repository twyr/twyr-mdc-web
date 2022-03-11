import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { MDCRipple } from '@material/ripple/index';

export default class MdcSwitchComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked inputElementId = 'xyz';
	@tracked selected = false;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.setState = this?._setState;
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, arguments);
		if (!this.#element) return;

		if (mutationRecord?.attributeName === 'id') {
			this.inputElementId = this.#element?.getAttribute?.('id');
			return;
		}

		this?._fireEvent?.('statuschange');
	}

	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);

		this.selected = !this?.selected;
		this?._fireEvent?.('statuschange');
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		// TODO: Optimize this by unsetting only those properties that have not been utilitized
		// in the current scenario

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-track-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-track-color'
		);

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-handle-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-handle-color'
		);

		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-focus-state-layer-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-hover-state-layer-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-switch-selected-pressed-state-layer-color'
		);

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-track-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-track-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-handle-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-handle-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-focus-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-hover-state-layer-color',
			`var(${paletteColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-switch-selected-pressed-state-layer-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		MDCRipple?.attachTo?.(
			this.#element?.querySelector?.('div.mdc-switch__handle')
		);

		this.inputElementId = this.#element?.getAttribute?.('id');
		this?.recalcStyles?.();

		if (this.#element?.hasAttribute?.('selected')) this.selected = true;

		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Computed Properties
	get label() {
		const stdLabel = this?.args?.label ?? 'Switch';
		let statusLabel = null;
		if (this.selected) statusLabel = this?.args?.selectedLabel ?? null;
		else statusLabel = this?.args?.unselectedLabel ?? null;

		return statusLabel ?? stdLabel;
	}
	// #endregion

	// #region Private Methods
	@action
	_fireEvent(name) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: this.#controls,
				status: {
					disabled: this.#element?.disabled,
					on: this?.selected
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	_setState(status) {
		this.#debug?.(`_setState: `, status);

		let shouldFireEvent = false;

		if (
			status?.on !== null &&
			status?.on !== undefined &&
			this?.selected !== status?.on
		) {
			this.selected = status?.on;
			shouldFireEvent ||= true;
		}

		if (
			status?.disabled !== null &&
			status?.disabled !== undefined &&
			this.#element.disabled !== status?.disabled
		) {
			this.#element.disabled = status?.disabled;
			shouldFireEvent ||= true;
		}

		if (!shouldFireEvent) return;

		this?._fireEvent?.('statuschange');
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-switch');
	#element = null;

	#controls = {};
	// #endregion
}
