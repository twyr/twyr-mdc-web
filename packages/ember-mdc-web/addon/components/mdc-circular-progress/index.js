import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcCircularProgressComponent extends Component {
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
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;
	}
	// #endregion

	// #region Computed Properties
	get cxCy() {
		if (this?.size === 'large') {
			return `24`;
		}

		if (this?.size === 'medium') {
			return `16`;
		}

		if (this?.size === 'small') {
			return `12`;
		}

		return `24`;
	}

	get label() {
		return this?.args?.label ?? 'circular progress bar';
	}

	get majorStrokeWidth() {
		if (this?.size === 'large') {
			return `4`;
		}

		if (this?.size === 'medium') {
			return `3`;
		}

		if (this?.size === 'small') {
			return `2.5`;
		}

		return `4`;
	}

	get minorStrokeWidth() {
		if (this?.size === 'large') {
			return `3.2`;
		}

		if (this?.size === 'medium') {
			return `2.4`;
		}

		if (this?.size === 'small') {
			return `2`;
		}

		return `3.2`;
	}

	get r() {
		if (this?.size === 'large') {
			return `18`;
		}

		if (this?.size === 'medium') {
			return `12.5`;
		}

		if (this?.size === 'small') {
			return `8.75`;
		}

		return `18`;
	}

	get size() {
		return this?.args?.size ?? 'large';
	}

	get strokeDashArray() {
		if (this?.size === 'large') {
			return `113.097`;
		}

		if (this?.size === 'medium') {
			return `78.54`;
		}

		if (this?.size === 'small') {
			return `54.978`;
		}

		return `113.097`;
	}

	get strokeDashOffset() {
		if (this?.size === 'large') {
			return `56.549`;
		}

		if (this?.size === 'medium') {
			return `39.27`;
		}

		if (this?.size === 'small') {
			return `27.489`;
		}

		return `56.549`;
	}

	get viewBox() {
		if (this?.size === 'large') {
			return `0 0 48 48`;
		}

		if (this?.size === 'medium') {
			return `0 0 32 32`;
		}

		if (this?.size === 'small') {
			return `0 0 24 24`;
		}

		return `0 0 48 48`;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-circular-progress');
	#element = null;
	// #endregion
}
