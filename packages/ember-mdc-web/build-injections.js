'use strict';

export default class EmberMdcWebBuildHooks {
	// #region Public Fields
	// #endregion

	// #region Constructor
	constructor() {
		console?.log?.(`\n\nEmberMdcWebBuildHooks::constructor\n\n`);
	}
	// #endregion

	// #region Public Methods
	contentFor(type, config, content) {
		console?.log?.(
			`\n\nEmberMdcWebBuildHooks::CONTENT FOR BUILD HOOK: ${JSON?.stringify?.(
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
		console?.log?.(`\n\nEmberMdcWebBuildHooks::BODY FOOTER BUILD HOOK\n\n`);
		if (config?.emdcBodyFooterInvoked) return null;

		config.emdcBodyFooterInvoked = true;

		return `
	<div class='ember-mdc-web-body-footer none'>
		${JSON?.stringify?.(config, null, '\t')}
		<br />
		<br />
		${JSON?.stringify?.(content, null, '\t')}
	</div>`;
	}
	// #endregion

	// #region Private Methods
	// #endregion

	// #region Private Attributes
	// #endregion
}
