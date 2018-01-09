# Module for common Java code generation utilities
[![Travis][img-travis-master]][url-travis-master]
[![Coveralls][img-coveralls-master]][url-coveralls-master]
[![Version][img-version]][url-npm]
[![License][img-license]][url-npm]

[img-travis-master]: https://travis-ci.org/ibm-developer/java-codegen-common.svg?branch=master
[url-travis-master]: https://travis-ci.org/ibm-developer/java-codegen-common/branches

[img-coveralls-master]: https://coveralls.io/repos/github/ibm-developer/java-codegen-common/badge.svg
[url-coveralls-master]: https://coveralls.io/github/ibm-developer/java-codegen-common

[url-npm]: https://www.npmjs.com/package/ibm-java-codegen-common
[img-license]: https://img.shields.io/npm/l/ibm-java-codegen-common.svg
[img-version]: https://img.shields.io/npm/v/ibm-java-codegen-common.svg

This is a module that contains common Java code generation libraries used by various Java generators.

# Contribution

In order to publish changes, you will need to fork the repository or ask to join the `ibm-developer` org and branch off the `master` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) before contributing. To help you with commit a commit template is provide.
Run `config.sh` to initialize the commit template to your `.git/config` or you can use 

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `master`, make sure the build passes. A team member will review and merge your pull request.
Once merged to `master` one pull request will be created against `master`. Make sure that the CHANGELOG.md and the package.json is correct before merging the auto generated pull request. After the autogenerated 
pull request has been merged to `master` the version will be bumped and published to npm.
