# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Created unit tests for new modules

### Changed
- Version numbers in CHANGELOG now allow to compare changes with previous release
- Separated some business logic into separate modules
- Updated README with CSS requirements for scale and spin transitions

### Removed
- Vendor prefixes are not added anymore

### Fixed
- Fixed and improved README (emojis have been removed from the headings to fix broken links)
- Fixed some JSDoc typos

## [0.5.0] - 2022-03-15
### Changed
- Documented how to use svelte-reveal with SvelteKit

## [0.4.0] - 2021-12-21
### Changed
- Removed unused imports
- New releases now contains output of npm pack
- Sourcemap is no longer included in the bundle (package size is now drastically lower)
- Added some new tests

## [0.3.3] - 2021-12-05
### Changed
- Better internal architecture
- General improvement to README
- Extended documentation for transitions in README

### Fixed
- ``setDefaultOptions`` now works as expected
- Scale and spin transitions now look much better

## [0.3.2] - 2021-11-28
### Changed
- Stopped using inline styles in favor of proper classes
- Better internal project structure

### Fixed
- Same type transitions now don't share properties anymore

## [0.3.1] - 2021-11-18
### Fixed
- Generated tag name in CI/CD pipeline

## [0.3.0] - 2021-11-18
### Changed
- Added link to a demo Svelte REPL in README

### Fixed
- Fixed some broken links in README

## [0.2.0] - 2021-11-17
### Added
- Bug report issue form
- Feature request issue form
- Docker development environment

### Changed
- Improved regex responsible for cleaning strings
- Better naming in GitHub CI workflow

## [0.1.0] - 2021-11-16
- Initial beta release

[0.1.0]: https://github.com/DaveKeehl/svelte-reveal/releases/tag/0.1.0
[0.2.0]: https://github.com/DaveKeehl/svelte-reveal/compare/0.1.0...0.2.0
[0.3.0]: https://github.com/DaveKeehl/svelte-reveal/compare/0.2.0...0.3.0
[0.3.1]: https://github.com/DaveKeehl/svelte-reveal/compare/0.3.0...0.3.1
[0.3.2]: https://github.com/DaveKeehl/svelte-reveal/compare/0.3.1...0.3.2
[0.3.3]: https://github.com/DaveKeehl/svelte-reveal/compare/0.3.2...0.3.3
[0.4.0]: https://github.com/DaveKeehl/svelte-reveal/compare/0.3.3...0.4.0
[0.5.0]: https://github.com/DaveKeehl/svelte-reveal/compare/0.4.0...0.5.0