import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { nextBrowserTick } from '../../utils/next-browser-tick';

export default class MdcAbstractDropdownComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	@tracked disabled = false;
	@tracked open = false;
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.open = this?._open;
		this.controls.close = this?._close;
		this.controls.toggle = this?._toggle;

		this.controls.register = this?._registerElement;
		this.controls.calcContentPosition = this?._calcContentPosition;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#triggerElement = null;
		this.#contentElement = null;

		this.controls = {};
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setupInitState?.();
		this?._fireEvent?.('statuschange');
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this.open = this.#element?.hasAttribute?.('open');

		this?._setupInitState?.();
		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Controls
	@action
	_open() {
		this.#debug?.(`_open: `, arguments);
		if (!this.#element) {
			this.open = false;
			return;
		}

		if (this.#element?.disabled) {
			this.open = false;
			return;
		}

		this.open = true;

		this?._setupInitState?.();
		this?._fireEvent?.('statuschange');
	}

	@action
	_close() {
		this.#debug?.(`_close: `, arguments);
		this.open = false;

		if (!this.#element) return;

		if (this.#element?.disabled) return;

		this?._setupInitState?.();
		this?._fireEvent?.('statuschange');
	}

	@action
	_toggle() {
		this.#debug?.(`_toggle: `, arguments);
		if (!this.#element) {
			this.open = false;
			return;
		}

		if (this.#element?.disabled) {
			this.open = false;
			return;
		}

		this.open = !this?.open;

		this?._setupInitState?.();
		this?._fireEvent?.('statuschange');
	}

	@action
	_registerElement(position, element) {
		this.#debug?.(`registerElement::${position}: `, element);

		if (position == 'trigger') {
			this.#triggerElement = element;
		}

		if (position == 'content') {
			this.#contentElement = element;
		}

		this?._setupInitState?.();
	}

	@action
	async _calcContentPosition(options) {
		this.#debug?.(`_calcContentPosition::options: `, options);
		const posCalcFunc =
			this?.args?.contentPositionCalculator ||
			this?._contentPositionCalculator?.bind?.(this);

		const contentPosition = await posCalcFunc?.(
			this.#triggerElement,
			this.#contentElement,
			options
		);

		return contentPosition;
	}
	// #endregion

	// #region Computed Properties
	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}
	// #endregion

	// #region Private Methods
	async _contentPositionCalculator(triggerElement, contentElement, options) {
		this.#debug?.(`_contentPositionCalculator::options: `, options);
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

		// Init stuff - if we're matching widths, do it now, wait for height to settle, then measure
		// height. We need this to correctly set middle if that's how the yAlign rolls
		let contentElementStyle = window?.getComputedStyle?.(contentElement);
		if (options?.matchTriggerWidth) {
			contentElement.style.width = `${triggerElementDimensions?.width}px`;

			await nextBrowserTick?.();
			await nextBrowserTick?.();

			contentElementDimensions =
				contentElement?.getBoundingClientRect?.();
			contentElementStyle = window?.getComputedStyle?.(contentElement);
		}

		// Step 1: Set width according to input parameters
		position['width'] = contentElementDimensions?.width;
		position['height'] = contentElementDimensions?.height;

		// Step 2: Based on the required x-alignment, set style
		if (xAlign === 'left') position['left'] = 0;
		if (xAlign === 'right') position['right'] = 0;
		if (xAlign === 'center') {
			position['left'] =
				(triggerElementDimensions?.width - position?.['width']) / 2.0;
			position['right'] = position?.['left'] + position?.['width'];
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
		if (yAlign == 'top' || yAlign == 'middle') position['top'] += offsetY;

		if (yAlign == 'bottom' || yAlign == 'middle')
			position['bottom'] += offsetY;

		this.#debug?.(
			`_contentPositionCalculator::options: `,
			options,
			` position: `,
			position
		);

		delete position['height'];
		if (!options?.matchTriggerWidth) delete position['width'];

		return position;
	}

	_fireEvent(name) {
		this.#debug?.(`_fireEvent: ${name}`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				status: {
					open: this?.open,
					disabled: this?.disabled
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	_setupInitState() {
		if (this.#element?.disabled) {
			this.open = false;
		}

		if (this.#triggerElement) {
			this.#triggerElement?.controls?.setDropdownStatus?.({
				id: this.#element?.id,
				disabled: this?.disabled,
				open: this?.open
			});
		}

		if (this.#contentElement) {
			this.#contentElement?.controls?.setDropdownStatus?.({
				id: this.#element?.id,
				disabled: this?.disabled,
				open: this?.open
			});
		}
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
