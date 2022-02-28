import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcLinearProgressComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
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
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		this.#element
			?.querySelector?.('span.mdc-linear-progress__bar-inner')
			?.style?.removeProperty?.('--mdc-linear-progress-color');

		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		this.#element
			?.querySelector?.('span.mdc-linear-progress__bar-inner')
			?.style?.setProperty?.(
				'--mdc-linear-progress-color',
				`var(${paletteColour})`
			);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Computed Properties
	get bufferValue() {
		if (this?.args?.indeterminate) {
			return 0;
		}

		let value = Number(this?.args?.bufferedValue) ?? this?.rangeLower;
		if (Number?.isNaN(value)) value = this?.rangeLower;

		if (value < this?.rangeLower) value = this?.rangeLower;
		if (value > this?.rangeUpper) value = this?.rangeUpper;

		const bufferValue =
			(value - this?.rangeLower) / (this?.rangeUpper - this?.rangeLower);

		this.#debug?.(`bufferValue: ${bufferValue}`);
		return bufferValue;
	}

	get displayValue() {
		if (this?.args?.indeterminate) {
			return 0;
		}

		let value = Number(this?.args?.progress) ?? this?.rangeLower;
		if (Number?.isNaN(value)) value = this?.rangeLower;

		if (value < this?.rangeLower) value = this?.rangeLower;
		if (value > this?.rangeUpper) value = this?.rangeUpper;

		const displayValue =
			(value - this?.rangeLower) / (this?.rangeUpper - this?.rangeLower);

		this.#debug?.(`displayValue: ${displayValue}`);
		return displayValue;
	}

	get maxValue() {
		let maxValue = Number(this?.args?.maxValue) ?? 1;
		if (Number?.isNaN(maxValue)) maxValue = 1;

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
		return this?.args?.label ?? 'linear progress bar';
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
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-linear-progress');
	#element = null;
	#oneRem = 16;
	// #endregion
}
