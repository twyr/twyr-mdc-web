import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MdcBannerComponent extends Component {
	// #region Accessed Services
	@service('bannerManager') bannerManager;
	// #endregion

	// #region Tracked Attributes
	@tracked open = false;

	@tracked centered = false;
	@tracked stacked = false;

	@tracked text = null;
	@tracked icon = null;

	@tracked primaryActionLabel = null;
	@tracked secondaryActionLabel = null;

	@tracked palette = null;
	// #endregion

	// #region Untracked Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.#controls.show = this?._open;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.bannerManager?.register(this.#element?.id, null, false);

		this.#primaryActionHandler = null;
		this.#secondaryActionHandler = null;

		this.#element = null;

		this.#controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	async fireActionEvent(action, event) {
		this.#debug?.(`fireActionEvent::${action}: `, event);
		this.open = false;

		if (action === 'primary') {
			await this.#primaryActionHandler?.(event);
		}

		if (action === 'secondary') {
			await this.#secondaryActionHandler?.(event);
		}

		this.#primaryActionHandler = null;
		this.#secondaryActionHandler = null;

		this?.bannerManager?.notifyBannerClose?.(this.#element?.id);
	}
	// #endregion

	// #region Modifier Callbacks
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
		this?.bannerManager?.register(this.#element?.id, this.#controls, true);
	}
	// #endregion

	// #region Controls
	@action
	_open(options) {
		this.#debug?.(`_open: `, options);

		this.centered = options?.centered ?? false;
		this.stacked = options?.stacked ?? false;

		this.text = options?.text;
		this.icon = options?.icon;

		this.primaryActionLabel = options?.primaryActionLabel;
		this.secondaryActionLabel = options?.secondaryActionLabel;

		this.palette = options?.palette;

		this.#primaryActionHandler = options?.primaryActionHandler;
		this.#secondaryActionHandler = options?.secondaryActionHandler;

		this.open = options?.open ?? false;
		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Fields
	#debug = debugLogger('component:mdc-banner');
	#controls = {};

	#element = null;

	#primaryActionHandler = null;
	#secondaryActionHandler = null;
	// #endregion
}
