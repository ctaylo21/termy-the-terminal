# Change Log

## 1.2.0 - 2020-4-18

### Added

- Added autocomplete feature with <tab> keypress for all commands

## 1.1.1 - 2020-3-22

### Fixed

- Update input to disable auto correct/capitalize/complete

## 1.1.0 - 2020-3-22

### Fixed

- Removed image plugin that was breaking icons

## 1.0.6 - 2019-12-23

### Added

- Support for images to be used with cat

## 1.0.5 - 2019-12-21

### Added

- Support for arrow keys to move through command history

## Changed

- Auto-focus of terminal input once Termy is mounted

## 1.0.4 - 2019-12-13

### Fixed

- Incorrect README code example

## 1.0.3 - 2019-12-13

### Added

- inputPrompt prop to Termy

## 1.0.2 - 2019-11-10

### Updated

- Disable spellcheck in Termy

## 1.0.1 - 2019-08-04

### Updated

- New logo for README
- Installation instructions to README

## 1.0.0 - 2019-08-03

### Updated

- Increase version to 1.0.0 for publishing

## 0.9.0 - 2019-08-03

### Added

- rm command

## 0.8.0 - 2019-07-28

### Updated

- Switch build to rollup instead of webpack

## 0.7.0 - 2019-07-28

### Updated

- Update build to include types file

## 0.6.3 - 2019-07-27

### Updated

- Use matchSnapshot instead of matchInlineSnapshot to reduce clutter

## 0.6.2 - 2019-07-15

### Updated

- Scroll to bottom input when off screen

## 0.6.1 - 2019-07-15

### Updated

- Update help menu UI

## 0.6.0 - 2019-07-12

### Added

- Updated codebase to prepare for npm publish

## 0.5.2 - 2019-07-05

### Changed

- Cleanup of terminal code to unify command interface

## 0.5.1 - 2019-07-04

### Changed

- Refactor services to all match same contract

## 0.5.0 - 2019-05-27

### Added

- Cat command

## 0.4.1 - 2019-05-27

### Changed

- Add icons for ls command display

## 0.4.0 - 2019-05-26

### Added

- Mkdir command

## 0.3.5 - 2019-05-05

### Added

- Help command

## 0.3.4 - 2019-05-05

### Fixed

- Bug where ls from nested path with no arg was broken

## 0.3.3 - 2019-05-05

### Changed

- Updated UI for history container

## 0.3.2 - 2019-04-30

### Fixed

- Bug where ls with no args from nested path was broken

## 0.3.1 - 2019-04-28

### Added

- support for `..` in `ls` command paths

### Changed

- refactor internal command args for consistency
- abstracted path helpers into utilities

## 0.3.0 - 2019-04-28

### Added

- `ls` command support

## 0.2.0 - 2019-04-27

### Added

- `pwd` command support

## 0.1.1 - 2019-04-16

### Added

- `cd` command support

## 0.1.0 - 2019-01-11

### Changed

- Switched from standardJS to eslint
- Added automated linting on commit via lint-staged & husky

## 0.0.7 - 2019-01-11

### Changed

- Switched from regenerator-runtime to @babel/plugin-transform-runtime for async support

## 0.0.6 - 2019-01-09

- Internal changes (incremented dependency versions)

## 0.0.5 - 2019-01-09

### Changed

- Switched from webpack-serve to webpack-dev-server

## 0.0.4 - 2019-01-09

- Internal changes (incremented dependency versions)
