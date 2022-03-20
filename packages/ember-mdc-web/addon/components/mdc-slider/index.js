import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcSliderComponent extends Component {
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

		this.#element = null;
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug?.(`onClick: `, event);

		this?._fireEvent?.('statuschange', {
			newValue: this?._calcNewValue?.(event)
		});
	}

	@action
	startSliding(event) {
		this.#debug?.(`startSliding: `, event);
		if (!this.#element) return;

		event.target.onpointermove = this?._onSlide?.bind?.(this);
		event?.target?.setPointerCapture?.(event?.pointerId);
	}

	@action
	stopSliding(event) {
		this.#debug?.(`stopSliding: `, event);
		if (!this.#element) return;

		event?.target?.releasePointerCapture?.(event?.pointerId);
		event.target.onpointermove = null;

		this?._fireEvent?.('statuschange', {
			newValue: this?._calcNewValue?.(event)
		});
	}

	@action
	setThumbHoverClass(enter, event) {
		this.#debug?.(`setThumbHoverClass: ${enter}`);
		if (enter)
			event?.target?.classList?.add?.(
				'mdc-slider__thumb--with-indicator'
			);
		else
			event?.target?.classList?.remove?.(
				'mdc-slider__thumb--with-indicator'
			);
	}
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		this?._setupInitState?.();
		this?.recalcStyles?.();
	}

	@action
	recalcValue() {
		this.#debug?.(`recalcValue`);
		if (!this.#element) return;

		const sliderValue = Math?.ceil?.(
			((this?.displayValue - this?.rangeLower) /
				(this?.rangeUpper - this?.rangeLower)) *
				100
		);
		this.#element?.style?.setProperty?.(
			'--mdc-slider-value',
			`${sliderValue}%`
		);
	}

	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		// Step 1: Reset
		this.#element?.style?.removeProperty?.(
			'--mdc-slider-track-background-color'
		);
		this.#element?.style?.removeProperty?.('--mdc-slider-thumb-knob-color');
		this.#element?.style?.removeProperty?.('--mdc-slider-ripple-color');
		this.#element?.style?.removeProperty?.(
			'--mdc-slider-active-tick-color'
		);
		this.#element?.style?.removeProperty?.(
			'--mdc-slider-inactive-tick-color'
		);

		// Stop if the element is disabled
		if (this.#element?.disabled) return;

		// Step 2: Style / Palette
		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		const textColour = `--mdc-theme-on-${this?.args?.palette ?? 'primary'}`;

		this.#element?.style?.setProperty?.(
			'--mdc-slider-track-background-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-slider-thumb-knob-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-slider-ripple-color',
			`var(${paletteColour})`
		);

		this.#element?.style?.setProperty?.(
			'--mdc-slider-active-tick-color',
			`var(${textColour})`
		);
		this.#element?.style?.setProperty?.(
			'--mdc-slider-inactive-tick-color',
			`var(${paletteColour})`
		);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?._setupInitState?.();
		this?.recalcStyles?.();
		this?.recalcValue?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get displayValue() {
		let value = Number(this?.args?.value) ?? this?.rangeLower;
		if (Number?.isNaN(value)) value = this?.rangeLower;

		if (value < this?.rangeLower) value = this?.rangeLower;
		if (value > this?.rangeUpper) value = this?.rangeUpper;

		this.#debug?.(`displayValue: ${value}`);
		return value;
	}

	get maxValue() {
		let maxValue = Number(this?.args?.maxValue) ?? 100;
		if (Number?.isNaN(maxValue)) maxValue = 100;

		this.#debug?.(`maxValue: ${maxValue}`);
		return maxValue;
	}

	get minValue() {
		let minValue = Number(this?.args?.minValue) ?? 0;
		if (Number?.isNaN(minValue)) minValue = 0;

		this.#debug?.(`minValue: ${minValue}`);
		return minValue;
	}

	get label() {
		return this?.args?.label ?? 'slider';
	}

	get rangeLower() {
		const rangeLower =
			(Math?.abs?.(this?.minValue + this?.maxValue) -
				Math?.abs?.(this?.minValue - this?.maxValue)) /
			2;

		this.#debug?.(`rangeLower: ${rangeLower}`);
		return rangeLower;
	}

	get rangeUpper() {
		const rangeUpper =
			(Math?.abs?.(this?.minValue + this?.maxValue) +
				Math?.abs?.(this?.minValue - this?.maxValue)) /
			2;

		this.#debug?.(`rangeUpper: ${rangeUpper}`);
		return rangeUpper;
	}

	get step() {
		let step = Number(this?.args?.step) ?? 1;
		if (Number?.isNaN?.(step)) step = 1;

		this.#debug?.(`step: ${step}`);
		return step;
	}

	get numActiveTicks() {
		return 1 + (this?.args?.value - this?.rangeLower) / this?.step;
	}

	get numInactiveTicks() {
		return (this?.rangeUpper - this?.args?.value) / this?.step;
	}
	// #endregion

	// #region Private Methods
	_calcNewValue(event) {
		this.#debug?.(`_calcNewValue: `, event);

		const boundingRect = this.#element?.getBoundingClientRect?.();
		const currentX = event?.clientX;

		if (currentX <= boundingRect?.left) return this?.rangeLower;

		if (currentX >= boundingRect?.right) return this?.rangeUpper;

		const percentage =
			(currentX - boundingRect?.left) / boundingRect?.width;
		const differential = (this?.rangeUpper - this?.rangeLower) * percentage;
		const newValue = this?.rangeLower + differential;

		if (!this?.args?.discrete) return newValue;

		const numStepsFromMinimum = Math?.floor?.(
			(newValue - this?.rangeLower) / this?.step
		);

		let lowerNewValue = this?.rangeLower + numStepsFromMinimum * this?.step;
		if (lowerNewValue < this?.rangeLower) lowerNewValue = this?.rangeLower;

		let upperNewValue = lowerNewValue + this?.step;
		if (upperNewValue > this?.rangeUpper) upperNewValue = this?.rangeUpper;

		let discreteNewValue = newValue;
		if (newValue - lowerNewValue <= upperNewValue - newValue) {
			discreteNewValue = lowerNewValue;
		} else {
			discreteNewValue = upperNewValue;
		}

		// this.#debug?.(`_calcNewValue: `, {
		// 	newValue: newValue,
		// 	numStepsFromMinimum: numStepsFromMinimum,

		// 	lowerNewValue: lowerNewValue,
		// 	upperNewValue: upperNewValue,

		// 	distFromLower: newValue - lowerNewValue,
		// 	distFromUpper: upperNewValue - newValue,

		// 	discreteNewValue: discreteNewValue
		// });

		return discreteNewValue;
	}

	_fireEvent(name, options) {
		this.#debug?.(`_fireEvent::${name}: `, options);
		if (!this.#element) return;

		const status = Object?.assign?.(
			{},
			{
				disabled: this.#element?.hasAttribute?.('disabled'),
				label: this?.label,

				minValue: this?.args?.minValue,
				maxValue: this?.args?.maxValue,

				rangeLower: this?.rangeLower,
				rangeUpper: this?.rangeUpper,

				value: this?.args?.value,
				displayValue: this?.displayValue
			},
			options
		);

		const thisEvent = new CustomEvent(name, {
			detail: {
				id: this.#element?.id,
				status: status
			}
		});

		this.#element
			?.querySelector?.('input.mdc-slider__input')
			?.dispatchEvent?.(thisEvent);
	}

	_onSlide(event) {
		this.#debug?.(`_onSlide: `, event);

		event?.preventDefault?.();
		event?.stopPropagation?.();

		this?._fireEvent?.('statuschange', {
			newValue: this?._calcNewValue?.(event)
		});
	}

	_setupInitState() {
		if (
			this.#element?.querySelector?.('input.mdc-slider__input')?.disabled
		) {
			this.#element?.classList?.add?.('mdc-slider--disabled');
		} else {
			this.#element?.classList?.remove?.('mdc-slider--disabled');
		}
	}
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-slider');
	#element = null;
	// #endregion
}
