# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.2.0"></a>
# [2.2.0](https://github.ibm.com/arf/java-codegen-common/compare/v2.1.0...v2.2.0) (2017-08-07)


### Features

* **helpers:** allow inverted checks on string objects ([7a7a3c6](https://github.ibm.com/arf/java-codegen-common/commit/7a7a3c6))



<a name="2.1.0"></a>
# [2.1.0](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.5...v2.1.0) (2017-08-03)


### Bug Fixes

* **build:** add wicked scope to travis yml ([9c2a837](https://github.ibm.com/arf/java-codegen-common/commit/9c2a837))
* **build:** update osc cli tool ([92a666f](https://github.ibm.com/arf/java-codegen-common/commit/92a666f))


### Features

* **helpers:** add string helper for handlebars ([230b82d](https://github.ibm.com/arf/java-codegen-common/commit/230b82d))



<a name="2.0.6"></a>
## [2.0.6](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.5...v2.0.6) (2017-07-31)


### Bug Fixes

* **build:** add wicked scope to travis yml ([9c2a837](https://github.ibm.com/arf/java-codegen-common/commit/9c2a837))
* **build:** update osc cli tool ([92a666f](https://github.ibm.com/arf/java-codegen-common/commit/92a666f))



<a name="2.0.5"></a>
## [2.0.5](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.4...v2.0.5) (2017-07-27)


### Bug Fixes

* **config:** allow undefined artifact ids ([574b193](https://github.ibm.com/arf/java-codegen-common/commit/574b193))



<a name="2.0.4"></a>
## [2.0.4](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.3...v2.0.4) (2017-07-26)


### Bug Fixes

* **control:** fix to use correct handlebars processor ([122ebd8](https://github.ibm.com/arf/java-codegen-common/commit/122ebd8))



<a name="2.0.3"></a>
## [2.0.3](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.2...v2.0.3) (2017-07-21)


### Bug Fixes

* **build:** allow optional versions in dependency checks ([b53d419](https://github.ibm.com/arf/java-codegen-common/commit/b53d419))



<a name="2.0.2"></a>
## [2.0.2](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.1...v2.0.2) (2017-07-17)


### Bug Fixes

* **context:** reset configFiles inside constructor ([2dcb6ee](https://github.ibm.com/arf/java-codegen-common/commit/2dcb6ee))



<a name="2.0.1"></a>
## [2.0.1](https://github.ibm.com/arf/java-codegen-common/compare/v2.0.0...v2.0.1) (2017-07-13)


### Bug Fixes

* **log:** use node inspect to avoid circular JSON failures ([4a06a76](https://github.ibm.com/arf/java-codegen-common/commit/4a06a76))



<a name="2.0.0"></a>
# [2.0.0](https://github.ibm.com/arf/java-codegen-common/compare/v1.1.0...v2.0.0) (2017-07-06)


### Features

* **config:** Add defaults module ([36fa6c4](https://github.ibm.com/arf/java-codegen-common/commit/36fa6c4))
* **config:** Remove toObject method and add handlebars ([1befe11](https://github.ibm.com/arf/java-codegen-common/commit/1befe11))
* **defaults:** Add defaults module ([55ca373](https://github.ibm.com/arf/java-codegen-common/commit/55ca373))
* **infrastructure:** Add integration tests to travis ([37c0121](https://github.ibm.com/arf/java-codegen-common/commit/37c0121))


### BREAKING CHANGES

* **defaults:** new defaults module

Signed-off-by: Katherine Stanley <katheris@uk.ibm.com>



<a name="1.1.0"></a>
# [1.1.0](https://github.ibm.com/arf/java-codegen-common/compare/v1.0.0...v1.1.0) (2017-07-05)


### Bug Fixes

* **config:** Fix config this scope error ([5df845b](https://github.ibm.com/arf/java-codegen-common/commit/5df845b))


### Features

* **config:** Add addMissing function to config ([b486d2d](https://github.ibm.com/arf/java-codegen-common/commit/b486d2d))



<a name="1.0.0"></a>
# [1.0.0](https://github.ibm.com/arf/java-codegen-common/compare/v0.2.0...v1.0.0) (2017-07-04)


### Bug Fixes

* **config:** correctly add all items to config ([4ce9e8c](https://github.ibm.com/arf/java-codegen-common/commit/4ce9e8c))


### Features

* **config:** move deps to config from context ([d39bc52](https://github.ibm.com/arf/java-codegen-common/commit/d39bc52))


### BREAKING CHANGES

* **config:** methods moved from context to config.

Signed off by : Adam Pilkington apilkington@uk.ibm.com



<a name="0.2.0"></a>
# [0.2.0](https://github.ibm.com/arf/java-codegen-common/compare/v0.1.0...v0.2.0) (2017-07-03)


### Features

* **test:** Add assertNoContent to Maven and Gradle tests ([ec27614](https://github.ibm.com/arf/java-codegen-common/commit/ec27614))



<a name="0.1.0"></a>
# 0.1.0 (2017-06-22)


### Bug Fixes

* **build:** remove command to run integration tests on prerelease ([1ef222c](https://github.ibm.com/arf/java-codegen-common/commit/1ef222c))
* **context:** bug fix for checking arrays passed to context ([642f232](https://github.ibm.com/arf/java-codegen-common/commit/642f232))
* **infrastructure:** stop a failed scan failing the build ([482db19](https://github.ibm.com/arf/java-codegen-common/commit/482db19))
* **tests:** add try catch around reading config files to catch errors ([aa22340](https://github.ibm.com/arf/java-codegen-common/commit/aa22340))


### Features

* **general:** change references to use handlebars directly ([12bd60f](https://github.ibm.com/arf/java-codegen-common/commit/12bd60f))
* **general:** initial version of the common module ([c632943](https://github.ibm.com/arf/java-codegen-common/commit/c632943))
* **test:** add running external commands capability to tests ([0d77a5d](https://github.ibm.com/arf/java-codegen-common/commit/0d77a5d))
* **test:** move test libs into libs folder ([16bbeb8](https://github.ibm.com/arf/java-codegen-common/commit/16bbeb8))
* **tests:** create addBuildCommand for maven and gradle tests ([ccddbd0](https://github.ibm.com/arf/java-codegen-common/commit/ccddbd0))
