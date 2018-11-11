# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
