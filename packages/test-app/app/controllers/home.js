import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	@service('bannerManager') bannerManager;
	// #endregion

	// #region Tracked Attributes
	@tracked palette = 'error';
	@tracked bufferValue = 59;
	@tracked progress = 59;

	@tracked sliderValue = 10;
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		// const palettes = ['primary', 'secondary', 'error'];
		// let currPalette = 0;
		//
		// setInterval(() => {
		// 	currPalette++;
		// 	if(currPalette >= palettes?.length)
		// 		currPalette = 0;
		//
		// 	this.palette = palettes[currPalette];
		// }, 10000);
	}
	// #endregion

	// #region Lifecycle Hooks
	// #endregion

	// #region DOM Event Handlers - Banner
	@action
	bannerInitialized(element) {
		later?.(
			this,
			() => {
				this.#debug?.('bannerInitialized', element);

				this?.bannerManager?.show?.({
					centered: false,
					stacked: false,

					icon: 'crowd',
					text: 'This is the banner text',

					secondaryActionLabel: 'Hello',
					primaryActionLabel: 'World',

					palette: this.palette
				});
			},
			500
		);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	closeChip(event) {
		this.#debug?.('closeChip', event);
	}

	@action
	processCheckboxEvent(event) {
		this.#debug?.('processCheckboxEvent', event);
	}

	@action
	processRadioGroupEvent(event) {
		this.#debug?.('processRadioGroupEvent', event);
	}

	@action
	onButtonGroupSelectionChange(event) {
		this.#debug?.('onButtonGroupSelectionChange', event?.detail);
		// if(!event?.detail?.status?.unselected) return;

		// setTimeout(() => {
		// 	const unselectedSegment = document?.getElementById?.(event?.detail?.status?.unselected);
		// 	event?.detail?.controls?.selectSegment?.(unselectedSegment);
		// }, 3000);
	}

	@action
	processSwitchEvent(event) {
		this.#debug?.('processSwitchEvent', event?.detail);
		// setTimeout(() => {
		// 	const newStatus = Object?.assign({}, event?.detail?.status);
		// 	newStatus.on = !newStatus?.on;
		// 	event?.detail?.controls?.setState?.(newStatus);
		// }, 3000);
	}

	@action
	processSliderEvent(event) {
		this.#debug?.('processSliderEvent', event?.detail);
		this.sliderValue = event?.detail?.status?.newValue;
	}

	@action
	selectValueChange(event) {
		this.#debug?.('selectValueChange', event?.detail);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('controller:home');
	#bannerControls = null;
	// #endregion
}
