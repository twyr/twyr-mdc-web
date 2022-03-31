import Component from './../mdc-abstract-dropdown/index';
import debugLogger from 'ember-debug-logger';

import { MDCRipple } from '@material/ripple/index';
import { action } from '@ember/object';
import { cancel, scheduleOnce } from '@ember/runloop';
import { ensureSafeComponent } from '@embroider/util';

/* Safe Subcomponent Imports */
import ListComponent from './list/index';
import TriggerComponent from './trigger/index';

export default class MdcMenuComponent extends Component {
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

		this.#controls.barReady = this?._onBarReady;
		this.#controls.openItem = this?._openItem;
	}
	// #endregion

	// #region Lifecycle Hooks
	willDestroy() {
		this.#debug?.(`willDestroy`);
		this?.args?.menuBarControls?.registerItem?.(
			this.#element,
			this.#controls,
			false
		);

		if (this.#initOpenSchedule) {
			cancel?.(this.#initOpenSchedule);
			this.#initOpenSchedule = null;
		}

		this.#controls = {};

		this.#mdcRipple = null;
		this.#element = null;

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Modifier Callbacks
	@action
	onAttributeMutation(mutationRecord) {
		this.#debug?.(`onAttributeMutation: `, mutationRecord);
		if (!this.#element) return;

		super.onAttributeMutation?.(mutationRecord);
		this?._setupInitState?.();
	}

	@action
	storeElement(element) {
		this.#debug?.(`storeElement: `, element);
		super.storeElement?.(element);

		this.#element = element;
		this.#mdcRipple = new MDCRipple(this.#element);

		this?._setupInitState?.();
		this?._onBarReady?.();

		this?.args?.menuBarControls?.registerItem?.(
			this.#element,
			this.#controls,
			true
		);
	}
	// #endregion

	// #region Controls
	@action
	_onBarReady() {
		this.#debug?.(`_onBarReady`);
		if (!this.#element?.hasAttribute?.('open')) return;

		if (!this?.args?.menuBarControls) {
			this.#initOpenSchedule = scheduleOnce?.(
				'afterRender',
				this,
				this?._open
			);

			return;
		}

		this.#initOpenSchedule = scheduleOnce?.(
			'afterRender',
			this,
			this?.args?.menuBarControls?.openItem,
			this.#element,
			true
		);
	}

	@action
	_openItem(open) {
		if (open) this?._open?.(true);
		else this?._close?.(true);
	}

	@action
	_open(fromMenuBar = false) {
		this.#debug?.(`_open: ${fromMenuBar}`);

		if (!this?.args?.menuBarControls) {
			super._open?.();
			return;
		}

		if (!fromMenuBar) {
			this?.args?.menuBarControls?.openItem?.(this.#element, true);
			return;
		}

		super._open?.();
	}

	@action
	_close(fromMenuBar = false) {
		this.#debug?.(`_close: ${fromMenuBar}`);

		if (!this?.args?.menuBarControls) {
			super._close?.();
			return;
		}

		if (!fromMenuBar) {
			this?.args?.menuBarControls?.openItem?.(this.#element, false);
			return;
		}

		super._close?.();
	}
	// #endregion

	// #region Computed Properties
	get tag() {
		return 'li';
	}

	get triggerComponent() {
		return this?._getComputedSubcomponent?.('trigger');
	}

	get listComponent() {
		return this?._getComputedSubcomponent?.('list');
	}
	// #endregion

	// #region Private Methods
	_setupInitState() {
		if (this.#element?.hasAttribute?.('disabled')) {
			this.#mdcRipple?.deactivate?.();
			return;
		}
	}

	_getComputedSubcomponent(componentName) {
		const subComponent =
			this?.args?.customComponents?.[componentName] ??
			this.#subComponents?.[componentName];

		return ensureSafeComponent(subComponent, this);
	}
	// #endregion

	// #region Default Sub-components
	#subComponents = {
		list: ListComponent,
		trigger: TriggerComponent
	};
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('component:mdc-menu');
	#controls = {};

	#element = null;
	#mdcRipple = null;

	#initOpenSchedule = null;
	// #endregion
}
