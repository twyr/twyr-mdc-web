import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

import invert from 'invert-color';

export default class ColourUtilitiesService extends Service {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug(`willDestroy`);
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	getOverlayColour(element, pseudoElement = null, opacity = '0.1') {
		const elementColour = window?.getComputedStyle?.(
			element,
			pseudoElement
		)?.color;
		const overlayColour = this.parseColour(elementColour, opacity);

		this.#debug(
			`getOverlayColour::elementColour: ${elementColour}, overlayColour: ${overlayColour}`
		);
		return overlayColour;
	}

	getInverseColour(element, pseudoElement, field, bwOnly) {
		let fieldColour = window?.getComputedStyle?.(element, pseudoElement)?.[
			field
		];
		let fieldOpacity = 1;

		this.#debug(`getInverseColour: ${field} Colour: ${fieldColour}`);

		if (fieldColour.indexOf('rgb(') === 0) {
			fieldColour = fieldColour
				?.replace?.(`rgb(`, '')
				?.replace?.(')', '')
				?.split?.(',')
				?.map?.((comp) => {
					return comp?.trim?.();
				});
			fieldOpacity = window?.getComputedStyle?.(element, pseudoElement)?.[
				'opacity'
			];
		}
		if (fieldColour.indexOf('rgba(') === 0) {
			fieldColour = fieldColour
				?.replace?.(`rgba(`, '')
				?.replace?.(')', '')
				?.split?.(',')
				?.map?.((comp) => {
					return comp?.trim?.();
				});
			fieldOpacity = fieldColour?.pop?.();
		}

		fieldOpacity = Number(fieldOpacity);
		if (fieldOpacity === 0) {
			this.#debug(
				`getInverseColour::bwOnly: ${!!bwOnly}, ${field} Colour: ${fieldColour}, opacity: ${fieldOpacity}, inverseColour: null`
			);
			return null;
		}

		bwOnly = !!bwOnly;
		if (bwOnly)
			bwOnly = {
				black: 'var(--twyr-colour-darkest)',
				white: 'var(--twyr-colour-lightest)'
			};

		const inverseColour = invert?.(fieldColour, bwOnly);

		this.#debug(
			`getInverseColour::bwOnly: ${!!bwOnly}, ${field} Colour: ${fieldColour}, ${field} Opacity: ${fieldOpacity}, inverseColour: ${inverseColour}`
		);
		return inverseColour;
	}

	parseColour(colour, opacity) {
		colour = colour?.trim?.();
		opacity = opacity?.trim?.();

		this.#debug(`parseColour: ${colour}`);
		if (!colour) return colour;

		if (colour.indexOf('rgba') === 0) {
			if (opacity) {
				this.#debug(
					`parseColour::rgba::opacity: ${colour.replace(
						/\d?\.?\d*\s*\)\s*$/,
						`${opacity})`
					)}`
				);
				return colour?.replace?.(/\d?\.?\d*\s*\)\s*$/, `${opacity})`);
			}

			this.#debug(`parseColour::rgba::no_opacity: ${colour}`);
			return colour;
		}

		if (colour.indexOf('rgb') === 0) {
			this.#debug(
				`parseColour::rgb: ${colour
					.replace(')', `, ${opacity ?? 0.1})`)
					.replace('(', 'a(')}`
			);
			return colour
				?.replace?.(')', `, ${opacity ?? 0.1})`)
				?.replace?.('(', 'a(');
		}

		if (colour.indexOf('#') === 0) {
			const rgbaColour = this?._hexToRGBA?.(colour, opacity);

			this.#debug(`parseColour::#: ${rgbaColour}`);
			return rgbaColour;
		}

		return colour;
	}
	// #endregion

	// #region Private Methods
	_hexToRGBA(hexColour, opacity) {
		const hex = hexColour[0] === '#' ? hexColour.substr(1) : hexColour;
		const dig = hex.length / 3;

		let red = hex.substr(0, dig);
		let green = hex.substr(dig, dig);
		let blue = hex.substr(dig * 2);

		if (dig === 1) {
			red += red;
			green += green;
			blue += blue;
		}

		return `rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(
			blue,
			16
		)}, ${opacity ?? 0.1})`;
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:colour-utilities');
	// #endregion
}
