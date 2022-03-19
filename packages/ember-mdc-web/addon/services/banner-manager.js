import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class BannerManagerService extends Service {
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

		this.#queuedBanners?.clear?.();
		this.#banners?.clear?.();

		super.willDestroy(...arguments);
	}
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Public Methods
	register(bannerId, controls, register) {
		this.#debug(`register::${bannerId}: ${register}`);

		if (!register) {
			this.#banners?.delete?.(bannerId);
			return;
		}

		this.#banners?.set?.(bannerId, controls);
	}

	show(options) {
		this.#debug(`show: `, options);
		if (!options?.bannerId) {
			options.bannerId = this.#banners?.keys?.()?.next?.()?.value;
		}

		if (!options?.bannerId) {
			this.#debug(
				`show: banner element id not given, and no element found. ignoring...`
			);
			return;
		}

		if (!this.#banners?.has?.(options?.bannerId)) {
			this.#debug(`show: banner element id not found. ignoring...`);
			return;
		}

		if (!this.#queuedBanners?.has?.(options?.bannerId)) {
			this.#queuedBanners?.set?.(options?.bannerId, []);
		}

		this.#queuedBanners?.get?.(options?.bannerId)?.push?.(options);
		this.#debug(
			`notify::queued banner list: `,
			JSON?.stringify?.([...this.#queuedBanners], null, '\t')
		);

		this?._showbanner?.(options?.bannerId);
	}

	notifyBannerClose(bannerId) {
		this.#debug(`onBannerClose: `, bannerId);
		if (!bannerId) {
			this.#debug(
				`onBannerClose: banner element id not given. ignoring...`
			);
			return;
		}

		this.#debug(`onBannerClose: clearing current banner`);

		this.#currentBanners[bannerId] = null;

		this.#debug(`onBannerClose: displaying next queued banner`);
		this?._showBanner?.(bannerId);
	}
	// #endregion

	// #region Private Methods
	_showBanner(bannerId) {
		this.#debug(`_showBanner: `, bannerId);
		if (this.#currentBanners?.[bannerId]) {
			this.#debug(
				`_showBanner: current banner already present for ${bannerId}. ignoring...`
			);
			return;
		}

		this.#debug(
			`_showBanner::queued banner list: `,
			JSON?.stringify?.([...this.#queuedBanners], null, '\t')
		);

		let nextBanner = this.#queuedBanners?.get?.(bannerId)?.shift?.();
		if (!nextBanner) {
			this.#debug(`_showBanner: no more banners to be shown...`);
			return;
		}

		this.#debug(`_showBanner: showing next queued banner: `, nextBanner);
		this.#currentBanners[bannerId] = nextBanner;

		const banner = this.#banners?.get?.(bannerId);
		banner?.show?.(nextBanner);
	}
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('service:banner-manager');
	#banners = new Map();

	#queuedBanners = new Map();
	#currentBanners = {};
	// #endregion
}
