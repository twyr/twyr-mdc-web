import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { v4 as uuidv4 } from 'uuid';

export default class MdcRadioGroupComponent extends Component {
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
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get groupName() {
		return this?.args?.groupName ?? uuidv4();
	}

	get radioComponent() {
		return this?._getComputedSubcomponent?.('radio');
	}
	// #endregion

	// #region Private Methods
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
		radio: 'mdc-radio-group/radio'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-radio-group');
	// #endregion
}
