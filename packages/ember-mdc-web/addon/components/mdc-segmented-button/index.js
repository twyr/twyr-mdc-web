import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import SegmentComponent from './segment/index';

export default class MdcSegmentedButtonComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
	// #endregion

	// #region Untracked Public Fields
	controls = {};
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug?.(`constructor`);

		this.controls.register = this._registerSegment;
		this.controls.select = this?._selectSegment;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);

		this.#segments?.clear?.();
		this.#element = null;

		this.controls = {};
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;
	}
	// #endregion

	// #region Controls
	@action
	_registerSegment(segment, controls, register) {
		this.#debug?.(`_registerSegment: `, segment, controls, register);

		if (!register) {
			this.#segments?.delete?.(segment);
			return;
		}

		this.#segments?.set?.(segment, controls);
	}

	@action
	_selectSegment(segment, selected) {
		this.#debug?.(`_selectSegment: `, segment);

		if (!this.#segments?.has?.(segment)) {
			this.#debug?.(`Segment not registered: `, segment);
			return;
		}

		const segmentControls = this.#segments?.get?.(segment);
		segmentControls?.select?.(selected);

		if (!this?.args?.singleSelect) return;

		const selectedSegment = this.#element?.querySelector?.(
			'button.mdc-segmented-button__segment--selected'
		);

		if (!selectedSegment) return;

		const selectedSegmentControls = this.#segments?.get?.(selectedSegment);
		selectedSegmentControls?.select?.(false);
	}
	// #endregion

	// #region Computed Properties
	get role() {
		return this?.args?.singleSelect ? 'radiogroup' : 'group';
	}

	get segmentComponent() {
		return this?._getComputedSubcomponent?.('segment');
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
		segment: SegmentComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-segmented-button');

	#element = null;
	#segments = new Map();
	// #endregion
}
