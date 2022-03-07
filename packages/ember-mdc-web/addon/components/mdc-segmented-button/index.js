import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';

import { action } from '@ember/object';

export default class MdcSegmentedButtonComponent extends Component {
	// #region Accessed Services
	// #endregion

	// #region Tracked Attributes
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
		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		this.#element = element;

		this?._fireEvent?.({
			name: 'init'
		});
	}
	// #endregion

	// #region Computed Properties
	get role() {
		const role = this?.args?.singleSelect ? 'radiogroup' : 'group';

		this.#debug?.(`role: ${role}`);
		return role;
	}
	get segmentComponent() {
		return this?._getComputedSubcomponent?.('segment');
	}
	// #endregion

	// #region Private Methods
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
	_selectSegment(segment) {
		this.#debug?.(`_selectSegment: `, segment);

		if (!this.#segments?.has?.(segment)) {
			this.#debug?.(`Segment not registered: `, segment);
			return;
		}

		let selectedSegment = null;
		if (this?.args?.singleSelect) {
			selectedSegment = this.#element?.querySelector?.(
				'button.mdc-segmented-button__segment--selected'
			);

			if (selectedSegment) {
				const selectedSegmentControls =
					this.#segments?.get?.(selectedSegment);
				selectedSegmentControls?.select?.(false);
			}
		}

		const segmentControls = this.#segments?.get?.(segment);
		const isSegmentSelected = segment?.classList?.contains?.(
			'mdc-segmented-button__segment--selected'
		);
		segmentControls?.select?.(!isSegmentSelected);

		const eventData = {
			name: 'select',
			selected: isSegmentSelected ? segment?.getAttribute?.('id') : null,
			unselected: isSegmentSelected
				? null
				: selectedSegment?.getAttribute?.('id')
		};

		this?._fireEvent?.(eventData);
	}

	@action
	_fireEvent(data) {
		this.#debug?.(`_fireEvent`);
		if (!this.#element) return;

		const thisEvent = new CustomEvent(data?.name, {
			detail: {
				id: this.#element?.getAttribute?.('id'),
				controls: {
					selectSegment: this?._selectSegment
				},
				status: {
					selected: data?.selected,
					unselected: data?.unselected
				}
			}
		});

		this.#element?.dispatchEvent?.(thisEvent);
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		this.#debug?.(`${componentName}-component`, subComponent);
		return subComponent;
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		segment: 'mdc-segmented-button/segment'
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-segmented-button');

	#element = null;
	#segments = new Map();
	// #endregion
}
