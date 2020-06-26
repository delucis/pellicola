# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.11.2](https://github.com/delucis/pellicola/compare/v0.11.1...v0.11.2) (2020-06-26)


### Bug Fixes

* upgrade ffmpeg-static from 4.2.2 to 4.2.3 ([#75](https://github.com/delucis/pellicola/issues/75)) ([5bc4440](https://github.com/delucis/pellicola/commit/5bc4440d9f9f9dcfe8c74cf8242cd550d5c0056f))

### [0.11.1](https://github.com/delucis/pellicola/compare/v0.11.0...v0.11.1) (2020-01-29)

## [0.11.0](https://github.com/delucis/pellicola/compare/v0.10.2...v0.11.0) (2020-01-27)


### ⚠ BREAKING CHANGES

* Node 8 is no longer supported. Tests are no longer run against Node 8 and the package now declares supported engines as Node >= 10. Use `pellicola@^0.10` if you need to support Node 8.

Co-authored-by: Chris Swithinbank <swithinbank@gmail.com>

### build

* Drop Node 8 support & update to `ava@^3` ([#59](https://github.com/delucis/pellicola/issues/59)) ([df1c6b9](https://github.com/delucis/pellicola/commit/df1c6b9f8481dc1240b157640bac8d068554b272))

### [0.10.2](https://github.com/delucis/pellicola/compare/v0.10.1...v0.10.2) (2019-12-30)

### [0.10.1](https://github.com/delucis/pellicola/compare/v0.10.0...v0.10.1) (2019-07-19)



## [0.10.0](https://github.com/delucis/pellicola/compare/v0.9.1...v0.10.0) (2019-06-05)


### Features

* Fix start frame option and add end frame option ([9b68717](https://github.com/delucis/pellicola/commit/9b68717))


### Tests

* Add tests for endTime/endFrame conflict warnings ([e7b6c89](https://github.com/delucis/pellicola/commit/e7b6c89))



### [0.9.1](https://github.com/delucis/pellicola/compare/v0.9.0...v0.9.1) (2019-05-07)



# [0.9.0](https://github.com/delucis/pellicola/compare/v0.8.0...v0.9.0) (2019-05-05)


### Features

* Require Node 8 and update dependencies ([#36](https://github.com/delucis/pellicola/issues/36)) ([fac9059](https://github.com/delucis/pellicola/commit/fac9059))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/delucis/pellicola/compare/v0.7.0...v0.8.0) (2018-11-23)


### Features

* **frame-maker:** Pass context to sketch functions ([#24](https://github.com/delucis/pellicola/issues/24)) ([122b57f](https://github.com/delucis/pellicola/commit/122b57f)), closes [#23](https://github.com/delucis/pellicola/issues/23)
* Add option to render from time or frame offset ([#25](https://github.com/delucis/pellicola/issues/25)) ([aa956e8](https://github.com/delucis/pellicola/commit/aa956e8)), closes [#21](https://github.com/delucis/pellicola/issues/21)
* Clean up temporary frame files by default ([#26](https://github.com/delucis/pellicola/issues/26)) ([2e7b989](https://github.com/delucis/pellicola/commit/2e7b989)), closes [#22](https://github.com/delucis/pellicola/issues/22)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/delucis/pellicola/compare/v0.6.1...v0.7.0) (2018-11-11)


### Features

* Add option to apply motion blur to frames ([#20](https://github.com/delucis/pellicola/issues/20)) ([aeca123](https://github.com/delucis/pellicola/commit/aeca123)), closes [#19](https://github.com/delucis/pellicola/issues/19)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/delucis/pellicola/compare/v0.6.0...v0.6.1) (2018-11-11)


### Bug Fixes

* Handle frame render errors better ([#18](https://github.com/delucis/pellicola/issues/18)) ([7363b24](https://github.com/delucis/pellicola/commit/7363b24)), closes [#16](https://github.com/delucis/pellicola/issues/16)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/delucis/pellicola/compare/v0.5.0...v0.6.0) (2018-11-10)


### Features

* Limit frames rendered in parallel ([#17](https://github.com/delucis/pellicola/issues/17)) ([6846207](https://github.com/delucis/pellicola/commit/6846207))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/delucis/pellicola/compare/v0.4.1...v0.5.0) (2018-11-07)


### Features

* assert pellicola must be passed a function and an object ([eda89b4](https://github.com/delucis/pellicola/commit/eda89b4))
* Show progress spinners on the command line ([#15](https://github.com/delucis/pellicola/issues/15)) ([4df84c8](https://github.com/delucis/pellicola/commit/4df84c8)), closes [#14](https://github.com/delucis/pellicola/issues/14)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/delucis/pellicola/compare/v0.4.0...v0.4.1) (2018-11-03)


### Bug Fixes

* Round totalFrames when calculated from duration & fps ([#13](https://github.com/delucis/pellicola/issues/13)) ([9ee74ea](https://github.com/delucis/pellicola/commit/9ee74ea)), closes [#12](https://github.com/delucis/pellicola/issues/12)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/delucis/pellicola/compare/v0.3.1...v0.4.0) (2018-10-25)


### Features

* **frame-maker:** Expose canvas image methods to render functions ([#9](https://github.com/delucis/pellicola/issues/9)) ([b73c451](https://github.com/delucis/pellicola/commit/b73c451)), closes [#8](https://github.com/delucis/pellicola/issues/8)
* Generate frames sequentially by default ([#10](https://github.com/delucis/pellicola/issues/10)) ([7996651](https://github.com/delucis/pellicola/commit/7996651)), closes [#5](https://github.com/delucis/pellicola/issues/5)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/delucis/pellicola/compare/v0.3.0...v0.3.1) (2018-10-24)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/delucis/pellicola/compare/v0.2.0...v0.3.0) (2018-10-23)


### Features

* **compile-video:** Bundle ffmpeg-static ([#1](https://github.com/delucis/pellicola/issues/1)) ([1f16f29](https://github.com/delucis/pellicola/commit/1f16f29))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/delucis/pellicola/compare/v0.1.0...v0.2.0) (2018-10-22)


### Features

* **compile-video:** Create output directory if it doesn’t already exist ([86d1180](https://github.com/delucis/pellicola/commit/86d1180))



<a name="0.1.0"></a>
# 0.1.0 (2018-10-22)


### Bug Fixes

* **frame-maker:** Fix playhead to end on `1` rather than `1 - 1 / totalFrames` ([100befc](https://github.com/delucis/pellicola/commit/100befc))


### Features

* Initial commit of core functionality ([c095ec3](https://github.com/delucis/pellicola/commit/c095ec3))
* **pellicola:** Allow sketch functions to be asynchronous ([eb38287](https://github.com/delucis/pellicola/commit/eb38287))
