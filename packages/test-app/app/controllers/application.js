import Controller from '@ember/controller';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked navIconElement = null;
	@tracked palette = 'secondary';

	@tracked bufferValue = 59;
	@tracked progress = 59;

	@tracked showAlert = true;
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
	storeNavigationIconElement(navIconElement) {
		this.#debug?.('storeNavigationIconElement: ', navIconElement);
		this.navIconElement = navIconElement;

		// setInterval(() => {
		// 	this.progress += 0.1;
		// 	if(this.progress > 100)
		// 		this.progress = 0;
		// }, 100);
	}

	@action
	closeChip(event) {
		this.#debug?.('closeChip', event?.detail);
	}

	@action
	processCheckboxEvent(event) {
		this.#debug?.('processCheckboxEvent', event?.detail);

		// setTimeout(() => {
		// 	const newStatus = Object?.assign?.({}, event?.detail?.status);
		// 	const checkboxControls = event?.detail?.controls;

		// 	newStatus.checked = !newStatus.checked;
		// 	checkboxControls?.setState?.(newStatus);
		// }, 2000);
	}

	@action
	processRadioGroupEvent(event) {
		this.#debug?.('processRadioGroupEvent', event?.detail);

		// setTimeout(() => {
		// 	const newStatus = Object?.assign?.({}, event?.detail?.status);
		// 	delete newStatus.radio;

		// 	const radio = document?.getElementById?.(
		// 		event?.detail?.status?.radio
		// 	);
		// 	const radioGroupControls = event?.detail?.controls;

		// 	newStatus.checked = !newStatus.checked;
		// 	radioGroupControls?.selectRadio?.(radio, newStatus);
		// }, 3000);
	}

	@action
	processListGroupEvent(event) {
		this.#debug?.('processListGroupEvent', event?.detail);
		// if(!event?.detail?.status?.unselected) return;

		// setTimeout(() => {
		// 	const unselectedItem = document?.getElementById?.(event?.detail?.status?.unselected);
		// 	event?.detail?.controls?.selectItem?.(unselectedItem, true);
		// }, 5000);
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
	processAlertAction(event) {
		this.#debug?.('processAlertAction', event);
		this.showAlert = false;

		setTimeout(() => {
			this.showAlert = true;
		}, 5000);
	}

	@action
	processAlertClose(event) {
		this.#debug?.('processAlertClose', event);
		this.showAlert = false;
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger?.('application:test-app');
	// #endregion
}
