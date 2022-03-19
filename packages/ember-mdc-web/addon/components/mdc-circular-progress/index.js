import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcCircularProgressComponent extends Component {
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
	// #endregion

	// #region Modifier Callbacks
	@action
	recalcStyles() {
		this.#debug?.(`recalcStyles: re-calculating styling`);
		if (!this.#element) return;

		this.#element
			?.querySelector?.(
				'circle.mdc-circular-progress__determinate-circle'
			)
			?.style?.removeProperty?.('--mdc-circular-progress-stroke-color');

		const paletteColour = `--mdc-theme-${this?.args?.palette ?? 'primary'}`;
		this.#element
			?.querySelector?.(
				'circle.mdc-circular-progress__determinate-circle'
			)
			?.style?.setProperty?.(
				'--mdc-circular-progress-stroke-color',
				`var(${paletteColour})`
			);
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		const remSize = window?.getComputedStyle?.(document?.documentElement)?.[
			'fontSize'
		];
		this.#oneRem = Number(remSize?.replace?.('px', ''));

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get cxCy() {
		const cxCy = this?.size / 2 ?? 24;
		this.#debug?.(`cxCy: ${cxCy}`);
		return cxCy;
	}

	get displayValue() {
		const rangeUpper =
			(Math?.abs?.(this?.minValue + this?.maxValue) +
				Math?.abs?.(this?.minValue - this?.maxValue)) /
			2;
		this.#debug?.(`displayValue::rangeUpper: ${rangeUpper}`);

		const rangeLower =
			(Math?.abs?.(this?.minValue + this?.maxValue) -
				Math?.abs?.(this?.minValue - this?.maxValue)) /
			2;
		this.#debug?.(`displayValue::rangeLower: ${rangeLower}`);

		let value = Number(this?.args?.progress) ?? rangeLower;
		if (Number?.isNaN(value)) value = rangeLower;

		if (value < rangeLower) value = rangeLower;
		if (value > rangeUpper) value = rangeUpper;

		const displayValue = (value - rangeLower) / (rangeUpper - rangeLower);
		this.#debug?.(`displayValue::displayValue: ${displayValue}`);

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
		return this?.args?.label ?? 'circular progress bar';
	}

	get radius() {
		this.#debug?.(`radius: ${this?.cxCy * 0.75}`);
		return this?.cxCy * 0.75;
	}

	get size() {
		let size = Number(this?.args?.size) ?? 3;
		if (Number?.isNaN?.(size)) size = 3;

		return size * this.#oneRem;
	}

	get strokeDashArray() {
		const filledArcLength = 2 * Math?.PI * this?.radius;
		this.#debug?.(`strokeDashArray::filledArcLength: ${filledArcLength}`);

		return filledArcLength;
	}

	get strokeDashOffset() {
		const unfilledArcLength =
			(1 - this?.displayValue) * (2 * Math?.PI * this?.radius);
		this.#debug?.(
			`strokeDashOffset::unfilledArcLength: ${unfilledArcLength}`
		);

		return unfilledArcLength;
	}

	get strokeWidth() {
		this.#debug?.(`strokeWidth: ${this?.cxCy * 0.2}`);
		return this?.cxCy * 0.16;
	}

	get viewBox() {
		const boxDims = this?.size ?? 48;

		this.#debug?.(`viewBox: 0 0 ${boxDims} ${boxDims}`);
		return `0 0 ${boxDims} ${boxDims}`;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-circular-progress');

	#element = null;
	#oneRem = 16;
	// #endregion
}
