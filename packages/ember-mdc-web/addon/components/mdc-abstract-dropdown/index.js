import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { nextBrowserTick } from '../../utils/next-browser-tick';

export default class MdcAbstractDropdownComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	controls = {};
	status = tracked({
		id: null,
		disabled: false,
		open: false
	});
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);

		this.controls.isOpen = this._getIsOpen;
		this.controls.close = this._close;
		this.controls.open = this._open;
		this.controls.toggle = this._toggle;
		this.controls.calcContentPosition = this._calcContentPosition;

		this?.args?.setControls?.(this.controls);
		this?.args?.setStatus?.(this.status);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);
		this._close();

		this.#triggerElement = null;
		this.#contentElement = null;

		this.controls.calcContentPosition = null;
		this.controls.toggle = null;
		this.controls.open = null;
		this.controls.close = null;

		this?.args?.setStatus?.(this.status);
		this?.args?.setControls?.(this.controls);

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	didMutate(entries) {
		this.#debug(`didMutate: `, entries);
		if (!this.#element) return;

		this.status.id = this.#element?.getAttribute?.('id');
		this.status.disabled = this.#element?.hasAttribute?.('disabled');

		if (this.status.disabled) this?._close?.();
	}

	@action
	registerContentElement(contentElement) {
		this.#debug(`registerContentElement: `, contentElement);
		this.#contentElement = contentElement;
	}

	@action
	registerTriggerElement(triggerElement) {
		this.#debug(`registerTriggerElement: `, triggerElement);
		this.#triggerElement = triggerElement;
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;

		this.status.id = this.#element?.getAttribute?.('id');
	}
	// #endregion

	// #region Computed Properties
	get dropdownControls() {
		return this.controls;
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}
	// #endregion

	// #region Private Methods
	@action
	_calcContentPosition(options) {
		this.#debug(`_calcContentPosition::options: `, options);
		const posCalcFunc =
			this?.args?.contentPositionCalculator ||
			this?._contentPositionCalculator?.bind?.(this);

		const contentPosition = posCalcFunc?.(
			this.#triggerElement,
			this.#contentElement,
			options
		);
		return contentPosition;
	}

	@action
	_close() {
		this.#debug(`_close`);

		this.status.open = false;
		this?.args?.setStatus?.(this.status);
	}

	@action
	_getIsOpen() {
		this.#debug(`_getIsOpen`);
		return this?.status?.open && !this?.status?.disabled;
	}

	@action
	_open() {
		this.#debug(`_open`);

		this.status.open = true;
		this?.args?.setStatus?.(this.status);
	}

	@action
	_toggle() {
		this.#debug(`_toggle`);
		if (this.status.open) this._close();
		else this._open();
	}

	async _contentPositionCalculator(triggerElement, contentElement, options) {
		this.#debug(`_contentPositionCalculator::options: `, options);
		const position = {
			left: null,
			right: null,
			top: null,
			bottom: null,

			height: null,
			width: null
		};

		const xAlign = options?.xAlign;
		const xOffset = options?.xOffset;

		const yAlign = options?.yAlign;
		const yOffset = options?.yOffset;

		const triggerElementDimensions =
			triggerElement?.getBoundingClientRect?.();
		let contentElementDimensions =
			contentElement?.getBoundingClientRect?.();
		let contentElementStyle = window.getComputedStyle(contentElement);

		// Init stuff - if we're matching widths, do it now, wait for height to settle, then measure
		// height. We need this to correctly set middle if that's how the yAlign rolls
		if (options?.matchTriggerWidth) {
			contentElement.style[
				'width'
			] = `${triggerElementDimensions?.width}px`;

			await nextBrowserTick();
			await nextBrowserTick();

			contentElementDimensions =
				contentElement?.getBoundingClientRect?.();
			contentElementStyle = window.getComputedStyle(contentElement);
		}

		// Step 1: Set width according to input parameters
		position['width'] = contentElementDimensions?.width;
		position['height'] = contentElementDimensions?.height;

		// Step 2: Based on the required x-alignment, set style
		if (xAlign === 'left') position['left'] = 0;
		if (xAlign === 'right') position['right'] = 0;
		if (xAlign === 'center') {
			position['left'] =
				(triggerElementDimensions?.width - position['width']) / 2.0;
			position['right'] = position['left'] + position['width'];
		}

		const offsetX = (triggerElementDimensions?.width * xOffset) / 100.0;
		if (xAlign === 'left' || xAlign === 'center')
			position['left'] += offsetX;
		if (xAlign === 'right' || xAlign === 'center')
			position['right'] += offsetX;

		// Step 3: Based on required y-alignment, set style
		if (yAlign === 'top')
			position['top'] =
				Number(contentElementStyle?.top?.replace('px', '')) -
				(triggerElementDimensions?.height +
					contentElementDimensions?.height);
		if (yAlign === 'bottom')
			position['top'] = Number(
				contentElementStyle?.top?.replace('px', '')
			);
		if (yAlign === 'middle') {
			position['top'] =
				Number(contentElementStyle?.top?.replace('px', '')) -
				triggerElementDimensions?.height / 2.0;
			position['bottom'] = position['top'] + position['height'];
		}

		const offsetY = (triggerElementDimensions?.height * yOffset) / 100.0;
		if (position['top'] || position['middle']) position['top'] += offsetY;
		if (position['bottom'] || position['middle'])
			position['bottom'] += offsetY;

		this.#debug(
			`_contentPositionCalculator::options: `,
			options,
			` position: `,
			position
		);

		delete position['height'];
		if (!options?.matchTriggerWidth) delete position['width'];

		return position;
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(
			`_getComputedSubcomponent::${componentName}-component`,
			subComponent
		);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		trigger: 'mdc-abstract-dropdown/trigger',
		content: 'mdc-abstract-dropdown/content'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown');

	#element = null;
	#contentElement = null;
	#triggerElement = null;
	// #endregion
}
