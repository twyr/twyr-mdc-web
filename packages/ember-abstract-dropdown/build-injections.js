'use strict';

export default class EmberAbstractDropdownBuildHooks {
	// #region Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		console?.log?.(`\n\nEmberAbstractDropdownBuildHooks::constructor\n\n`);
	}
	// #endregion

	// #region Public Methods
	contentFor(type, config, content) {
		console?.log?.(
			`\n\nEmberAbstractDropdownBuildHooks::CONTENT FOR BUILD HOOK: ${JSON?.stringify?.(
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
			`\n\nEmberAbstractDropdownBuildHooks::BODY FOOTER BUILD HOOK\n\n`
		);
		if (config?.emdcBodyFooterInvoked) return null;

		config.emdcBodyFooterInvoked = true;

		return content;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	// #endregion
}
