import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ChipComponent from './chip/index';

export default class MdcChipSetComponent extends Component {
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

		if (this?.chipsetType === 'grid') {
			this.#element?.removeAttribute?.('aria-orientation');
			this.#element?.removeAttribute?.('aria-multiselectable');
		} else {
			this.#element?.setAttribute?.('aria-orientation', 'horizontal');
			this.#element?.setAttribute?.(
				'aria-multiselectable',
				this?.args?.multiselect ?? false
			);
		}
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?.recalcStyles?.();
	}
	// #endregion

	// #region Controls
	// #endregion

	// #region Computed Properties
	get chipsetType() {
		return this?.args?.role ?? 'grid';
	}

	get chipComponent() {
		return this?._getComputedSubcomponent?.('chip');
	}

	get chipRole() {
		return this?.chipsetType === 'grid' ? 'row' : 'presentation';
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
		chip: ChipComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-chip-set');
	#element = null;
	// #endregion
}
