import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MdcBannerComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;

	@tracked centered = false;
	@tracked stacked = false;

	@tracked text = null;
	@tracked icon = null;

	@tracked primaryActionLabel = null;
	@tracked secondaryActionLabel = null;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.open = this?._open;
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers
	@action
	fireActionEvent(action) {
		this.#debug?.(`fireActionEvent: ${action}`);

		this?._open?.({
			open: false
		});

		this?._fireEvent?.(action);
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.(
			'--mdc-banner-graphic-background-color'
		);

		this.#element?.style?.removeProperty?.('--mdc-banner-graphic-color');

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-banner-graphic-background-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-banner-graphic-color',
			`var(${textColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Computed Properties
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
					open: this?.open,

					centered: this?.centered,
					stacked: this?.stacked,

					text: this?.text,
					icon: this?.icon,

					primaryActionLabel: this?.primaryActionLabel,
					secondaryActionLabel: this?.secondaryActionLabel
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	@action
	_open(options) {
		this.#debug?.(`_open: `, options);

		let shouldFire = false;

		if (this?.centered !== options?.centered) {
			this.centered = options?.centered ?? false;
			shouldFire ||= true;
		}

		if (this?.stacked !== options?.stacked) {
			this.stacked = options?.stacked ?? false;
			shouldFire ||= true;
		}

		if (this?.text !== options?.text) {
			this.text = options?.text;
			shouldFire ||= true;
		}

		if (this?.icon !== options?.icon) {
			this.icon = options?.icon;
			shouldFire ||= true;
		}

		if (this?.primaryActionLabel !== options?.primaryActionLabel) {
			this.primaryActionLabel = options?.primaryActionLabel;
			shouldFire ||= true;
		}

		if (this?.secondaryActionLabel !== options?.secondaryActionLabel) {
			this.secondaryActionLabel = options?.secondaryActionLabel;
			shouldFire ||= true;
		}

		if (this?.open !== options?.open) {
			this.open = options?.open ?? false;
			shouldFire ||= true;
		}

		if (!shouldFire) return;

		this?.recalcStyles?.();
		this?._fireEvent?.('statuschange');
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-banner');

	#element = null;
	#controls = {};
	// #endregion
}
