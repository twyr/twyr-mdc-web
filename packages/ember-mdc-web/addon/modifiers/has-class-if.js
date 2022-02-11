import Modifier from 'ember-modifier';
import debugLogger from 'ember-debug-logger';

export default class HasClassIfModifier extends Modifier {
	// #region Accessed Services
	// #endregion

	// #region Constructor
	constructor() {
		super(...arguments);
		this.#debug(`constructor`);
	}
	// #endregion

	// #region Lifecycle Hooks
	didReceiveArguments() {
		super.didReceiveArguments(...arguments);
		this.#debug(
			`didReceiveArguments:\nelement: `,
			this?.element,
			`\nargs: `,
			this?.args
		);

		const yesClassList =
			this?.args?.positional?.[1]
				?.split?.(' ')
				?.map?.((className) => {
					return className ? className?.trim?.() : null;
				})
				.filter((className) => {
					return !!className && className.length;
				}) ?? [];

		const noClassList =
			this?.args?.positional?.[2]
				?.split?.(' ')
				?.map?.((className) => {
					return className ? className?.trim?.() : null;
				})
				.filter((className) => {
					return !!className && className.length;
				}) ?? [];

		const condition = this?.args?.positional?.[0];
		if (condition) {
			this.#debug(
				`didReceiveArguments:\ncondition: ${condition}\nyes classes: ${yesClassList.join(
					' '
				)}\nno classes: ${noClassList.join(' ')}`
			);
			if (yesClassList?.length)
				this?.element?.classList?.add?.(...yesClassList);
			if (noClassList?.length)
				this?.element?.classList?.remove?.(...noClassList);
		} else {
			this.#debug(
				`didReceiveArguments:\ncondition: ${condition}\nyes classes: ${yesClassList.join(
					' '
				)}\nno classes: ${noClassList.join(' ')}`
			);
			if (yesClassList?.length)
				this?.element?.classList?.remove?.(...yesClassList);
			if (noClassList?.length)
				this?.element?.classList?.add?.(...noClassList);
		}
	}
	// #endregion

	// #region DOM Event Handlers
	// #endregion

	// #region Computed Properties
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	#debug = debugLogger('modifier:has-class-if');
	// #endregion
}
