import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { isDisabled } from '../../utils/dom-element-attributes';
import { action } from '@ember/object';

export default class MdcBackdropComponent extends Component {
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
	// #endregion

	// #region DOM Event Handlers
	@action
	onClick(event) {
		this.#debug(`onClick: `, event);

		const isEventInsideElement =
			event?.target === this.#element ||
			this.#element?.contains?.(event?.target);
		if (isEventInsideElement) {
			event?.stopPropagation?.();
			event?.preventDefault?.();
		}

		if (isDisabled(this.#element)) return;

		this?.args?.onClick?.(event);
	}

	@action
	storeElement(element) {
		this.#debug(`storeElement: `, element);
		this.#element = element;
	}
	// #endregion

	// #region Computed Properties
	get positionClass() {
		const posClass = this?.args?.fullScreen ? 'fixed' : 'absolute';
		return posClass;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Default Sub-components
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-backdrop');
	#element = null;
	// #endregion
}
