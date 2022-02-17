<h1 align="center">
    Twy'r MDC Web
</h1>
<div align="center">
    <a href="https://spdx.org/licenses/MITNFA.html"><img src="https://img.shields.io/badge/License-MIT%20%2Bno--false--attribs-blue" /></a>
    <a href="https://github.com/twyr/twyr-mdc-web/blob/main/CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" /></a>
</div>
<hr />

<div align="center">
    <a href="https://emberjs.com">Ember 4.0+</a> implementation of <a href="https://material-components.github.io/material-components-web-catalog/#/">Material Design components (MDC) for the Web</a>
</div>
<div align="center">
    Built as part of the <a href="https://github.com/twyr">Twy&apos;r</a> effort by <a href="https://github.com/shadyvd">Vish Desai</a> and <a href="https://github.com/twyr/twyr-mdc-web/graphs/contributors">contributors</a>
</div>
<hr />

#### TABLE OF CONTENTS

-   [About](#about)
-   [Status](#status)
-   [Why](#why)
-   [Goals](#goals)
-   [Goals](#goals)
-   [Contributing](#contributing)
    -   [Code of Conduct](#code-of-conduct)
    -   [Developing](#developing)
    -   [Contributors](#contributors)
-   [License](#license)

#### ABOUT

This is a monorepo used for the development and maintenance of the [Ember](https://emberjs.com) implementation of [Material Components for the Web](https://material-components.github.io/material-components-web-catalog/#/), and consists of
two packages - the Ember MDC Web Addon itself, and an Ember App for testing, debugging, documenting, and showcasing the addon.

#### STATUS

| Category       | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conventions    | [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg)](https://conventionalcommits.org) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)                                                                                        |
| Code Stats     | [![Languages](https://badgen.net/lgtm/langs/g/twyr/twyr-mdc-web)](https://lgtm.com/projects/g/twyr/twyr-mdc-web) ![GitHub repo size](https://img.shields.io/github/repo-size/twyr/twyr-mdc-web) [![LoC](https://badgen.net/lgtm/lines/g/twyr/twyr-mdc-web)](https://lgtm.com/projects/g/twyr/twyr-mdc-web) [![Language grade](https://badgen.net/lgtm/grade/g/twyr/twyr-mdc-web)](https://lgtm.com/projects/g/twyr/twyr-mdc-web/context:javascript) [![Coverage Status](https://coveralls.io/repos/github/twyr/twyr-mdc-web/badge.svg?branch=main)](https://coveralls.io/github/twyr/twyr-mdc-web?branch=main) |
| Security       | [![Known Vulnerabilities](https://snyk.io/test/github/twyr/twyr-mdc-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/twyr/twyr-mdc-web?targetFile=package.json) [![Total alerts](https://img.shields.io/lgtm/alerts/g/twyr/twyr-mdc-web.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/twyr/twyr-mdc-web/alerts/) ![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@twyr/twyr-mdc-web)                                                                                                                     |
|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Development    | ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/twyr/twyr-mdc-web) ![GitHub last commit](https://img.shields.io/github/last-commit/twyr/twyr-mdc-web)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Issues & PRs   | ![GitHub open issues](https://img.shields.io/github/issues-raw/twyr/twyr-mdc-web) ![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/twyr/twyr-mdc-web) ![GitHub open prs](https://img.shields.io/github/issues-pr-raw/twyr/twyr-mdc-web) ![GitHub closed prs](https://img.shields.io/github/issues-pr-closed-raw/twyr/twyr-mdc-web)                                                                                                                                                                                                                                                      |
|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Release Status | ![GitHub package.json version](https://img.shields.io/github/package-json/v/twyr/twyr-mdc-web/main) ![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/twyr/twyr-mdc-web?sort=semver) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/twyr/twyr-mdc-web?sort=semver)                                                                                                                                                                                                                                                                                                  |
| Publish Status | ![node-current](https://img.shields.io/node/v/@twyr/twyr-mdc-web) ![npm bundle size](https://img.shields.io/bundlephobia/min/@twyr/twyr-mdc-web) ![npm](https://img.shields.io/npm/dy/@twyr/twyr-mdc-web)                                                                                                                                                                                                                                                                                                                                                                                                      |

#### WHY

Just because...

#### GOALS

Ember-related goals:

1. Build for [Ember 4.0+](https://emberjs.com) - with no expectation of backward compatibility
1. Build using [Embroider](https://github.com/embroider-build/embroider) - aim for "Native Support"

MDC Web related goals:

1. Build using the latest release of [MDC for the Web 13.0+](https://material-components.github.io/material-components-web-catalog/#/) - with no expectation of backward compatibility
2. Re-use MDC Javascript API for utilities (Ripples, etc.) to provide a "MDC Native" feel for the Ember components
3. Build using the SCSS files provided by MDC Web - extend/enhance only if necessary

#### CONTRIBUTING

##### Code of Conduct

All contributors to this project are expected to adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) specified.

##### Developing

Details on getting the code, setting up the development environment, and instructions on how to extend/build/test the code are detailed in the
[Contribution Guide](CONTRIBUTING.md)

##### Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

This project owes its existence to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://twyr.github.io"><img src="https://avatars1.githubusercontent.com/u/5027975?v=4" width="100px;" alt=""/><br /><sub><b>Vish Desai</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification. Contributions of any kind are welcome!

#### LICENSE

This project is licensed under the [MIT +no-false-attribs](https://spdx.org/licenses/MITNFA.html) license.
You may get a copy of the license by following the link, or at [LICENSE.md](LICENSE.md)
