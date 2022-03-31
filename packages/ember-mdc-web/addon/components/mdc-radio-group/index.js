import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { ensureSafeComponent } from '@embroider/util';
import { v4 as uuidv4 } from 'uuid';

/* Safe Subcomponent Imports */
import RadioComponent from './radio/index';

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

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		radio: RadioComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-radio-group');
	// #endregion
}
