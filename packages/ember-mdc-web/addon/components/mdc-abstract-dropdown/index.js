import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import nextBrowserTick from '../../utils/next-browser-tick';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';
import { tracked } from '@glimmer/tracking';

/* Safe Subcomponent Imports */
import TriggerComponent from './trigger/index';
import ContentComponent from './content/index';

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

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);

		this?._fireEvent?.('statuschange');
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);

		this?._fireEvent?.('init');
	}
	// #endregion

	// #region Controls
	@action
	_open() {
		this.#debug?.(`_open`);
		if (this?.open) return;

		if (!this.#element || this.#element?.hasAttribute?.('disabled')) return;
		this.open = true;

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);

		this?._fireEvent?.('statuschange');
	}

	@action
	_close() {
		this.#debug?.(`_close`);
		if (!this?.open) return;

		this.open = false;

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);

		this?._fireEvent?.('statuschange');
	}

	@action
	_toggle() {
		this.#debug?.(`_toggle`);
		if (this?.open) this?._close?.();
		else this?._open?.();
	}

	@action
	_registerElement(position, element, register) {
		this.#debug?.(`_registerElement::${position}::${register}: `, element);

		if (position === 'trigger') {
			this.#triggerElement = register ? element : null;
		}

		if (position === 'content') {
			this.#contentElement = register ? element : null;
		}

		if (!this.#element) return;

		const status = this?._setupStatus?.();
		this?._informSubComponents?.(status);
	}

	@action
	async _calcContentPosition(options) {
		this.#debug?.(`_calcContentPosition::options: `, options);
		const posCalcFunc =
			this?.args?.contentPositionCalculator ||
			this?._contentPositionCalculator?.bind?.(this);

		const contentPosition = await posCalcFunc?.(
			this.#element,
			this.#triggerElement?.element,
			this.#contentElement?.element,
			options
		);

		return contentPosition;
	}
	// #endregion

	// #region Computed Properties
	get tag() {
		return this?.args?.tag ?? 'div';
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}

	get contentComponent() {
		return this?._getComputedSubcomponent?.('content');
	}
	// #endregion

	// #region Private Methods
	async _contentPositionCalculator(
		element,
		triggerElement,
		contentElement,
		options
	) {
		this.#debug?.(`_contentPositionCalculator::arguments: `, arguments);
		const position = {
			dropdownRect: null,
			left: null,
			top: null
		};

		const xAlign = options?.xAlign;
		let xOffset = options?.xOffset;
		if (xAlign === 'right') xOffset = -xOffset;

		const yAlign = options?.yAlign;
		let yOffset = options?.yOffset;
		if (yAlign === 'top') yOffset = -yOffset;

		const elementDimensions = element?.getBoundingClientRect?.();
		position.dropdownRect = elementDimensions;

		// Step 1: Set width according to input parameters
		// Init stuff - if we're matching widths, do it now, wait for height to settle
		if (options?.matchTriggerWidth) {
			contentElement.style.width = `${elementDimensions?.width}px`;
			await nextBrowserTick?.();
		}

		const contentElementDimensions =
			contentElement?.getBoundingClientRect?.();

		// Step 2: Based on the required x-alignment, set horizontal style
		if (xAlign === 'left') {
			position['left'] = 0;
		}

		if (xAlign === 'right') {
			position['left'] =
				elementDimensions?.width - contentElementDimensions?.width;
		}

		if (xAlign === 'center') {
			position['left'] =
				(elementDimensions?.width - contentElementDimensions?.width) /
				2.0;
		}

		const offsetX = elementDimensions?.width * (xOffset / 100.0);
		position['left'] += offsetX;

		// Step 3: Based on required y-alignment, set vertical style
		if (yAlign === 'top')
			position['top'] = 0 - contentElementDimensions?.height;

		if (yAlign === 'bottom') {
			position['top'] = elementDimensions?.height;
		}

		if (yAlign === 'middle') {
			position['top'] =
				(elementDimensions?.height - contentElementDimensions?.height) /
				2.0;
		}

		const offsetY = elementDimensions?.height * (yOffset / 100.0);
		position['top'] += offsetY;

		this.#debug?.(
			`\n_contentPositionCalculator::options: `,
			options,
			`\n_contentPositionCalculator::position: `,
			position
		);

		// Finally, pass on the current position of the dropdown itself
		return position;
	}

	_fireEvent(name) {
		this.#debug?.(`_fireEvent: ${name}`);
		if (!this.#element) return;

		const status = this?._setupStatus?.();
		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				status: status
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	_informSubComponents(status) {
		this.#debug?.(`_informSubComponents:`, status);
		if (!this.#element) return;

		if (this.#triggerElement) {
			this.#triggerElement?.controls?.setDropdownStatus?.(status);
		}

		if (this.#contentElement) {
			this.#contentElement?.controls?.setDropdownStatus?.(status);
		}
	}

	_setupStatus() {
		const status = {
			id: this.#element?.id,
			disabled: this.#element?.hasAttribute?.('disabled'),
			open: this?.open
		};

		this.#debug?.(`_setupStatus: `, status);
		return status;
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		trigger: TriggerComponent,
		content: ContentComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-abstract-dropdown');

	#element = null;
	#contentElement = null;
	#triggerElement = null;
	// #endregion
}
