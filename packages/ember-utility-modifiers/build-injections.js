'use strict';

export default class EmberUtilityModifierBuildHooks {
	// #region Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		console?.log?.(`\n\nEmberUtilityModifierBuildHooks::constructor\n\n`);
	}
	// #endregion

	// #region Public Methods
	contentFor(type, config, content) {
		console?.log?.(
			`\n\nEmberUtilityModifierBuildHooks::CONTENT FOR BUILD HOOK: ${JSON?.stringify?.(
				arguments,
				null,
				'\t'
			)}\n\n`
		);

		let retValue = null;
		switch (type) {
			case 'body-footer':
				retValue = this?._contentForBodyFooter?.(config, content);
				break;
		}

		return retValue;
	}
	// #endregion

	// #region ContentFor Hooks
	_contentForBodyFooter(config, content) {
		console?.log?.(
			`\n\nEmberUtilityModifierBuildHooks::BODY FOOTER BUILD HOOK\n\n`,
			JSON?.stringify?.(config),
			'\n\n',
			JSON?.stringify?.(content),
			'\n\n'
		);
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	// #endregion
}
