/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//test the config module

'use strict';
const assert = require('assert');
const Config = require('../../lib/config');
const path = require('path');

const CONFIG_FILE = "config.js";

describe('Config behaviour', function() {
  it('should be possible to reset config values', function(){
    let config = new Config(require('../lib/defaults'));
    config.artifactId = 'testID';
    config.bluemix = {name : 'bxName'};
    config.reset();
    assert.equal('example', config.artifactId);
    assert.equal(undefined, config.bluemix);
  });
  it('should be possible to replace default config with options', function(){
    let config = new Config(require('../lib/defaults'));
    let options = {appName : 'testName'};
    config.overwrite(options);
    assert.equal(config.appName, 'testName');
  });
  it('should be possible to replace default config arrays with options', function(){
    let config = new Config(require('../lib/defaults'));
    let options = {technologies : ['rest', 'websocket']};
    config.overwrite(options);
    assert.equal(config.technologies.length, 2);
    assert.equal(config.technologies[0], 'rest');
    assert.equal(config.technologies[1], 'websocket');
  });
  it('should be possible to replace default config arrays with empty array options', function(){
    let config = new Config(require('../lib/defaults'));
    let options = {technologies : []};
    config.overwrite(options);
    assert.equal(config.technologies.length, 0);
  });
  it('should not be possible to create config using overwrite', function(){
    let config = new Config(require('../lib/defaults'));
    let options = {someConfig : 'someValue'};
    config.overwrite(options);
    assert.equal(config.someConfig, undefined);
  });
  it('should be possible to add missing options using addMissing', function(){
    let config = new Config();
    let defaults = require('../lib/defaults');
    let options = {someConfig : 'someValue', createType : 'newCreateType'};
    assert.equal(config.createType, undefined);
    config.addMissing(options, defaults);
    assert.equal(config.createType, 'newCreateType');
    assert.equal(config.someConfig, undefined);
  });
  it('should not be possible to call addMissing with undefined defaults', function(){
    let config = new Config();
    let options = {someConfig : 'someValue'};
    assert.throws(() => {config.addMissing(options, undefined)}, /addMissing expects defaults to be a defined/, 'Did not throw an exception for unknown defaults object');
  });
});

describe('Config defaults', function() {
  it('name should be set to "LibertyProject" when the value has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('LibertyProject', config.appName);
  });
  it('build should be set to "maven" when the build type has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('maven', config.buildType);
  });
  it('createType should be set to "basic" when the createType has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('basic', config.createType);
  });
  it('groupId should be set to "groupId" when the value has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('liberty.projects', config.groupId);
  });
  it('artifactId should be set to "artifactId" when the value has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('example', config.artifactId);
  });
  it('version should be set to "1.0-SNAPSHOT" when the version has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal('1.0-SNAPSHOT', config.version);
  });

  it('bluemix should be set to "undefined" when the bluemix has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal(undefined, config.bluemix);
  });

  it('input should be set to "undefined" when the input has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal(undefined, config.input);
  });

  it('technologies should be set to "[]" when the technologies has not been set', function(){
    let config = new Config(require('../lib/defaults'));
    assert(Array.isArray(config.technologies));
    assert.equal(0, config.technologies.length);
  });
});


describe('Config validation', function() {
  it('should not be valid when the name contains invalid characters', function(){
    let config = new Config(require('../lib/defaults'));
    assert.equal(true, config.isValid());
  });
  it('should not be valid when the name is either missing or an empty string', function(){
    let config = new Config(require('../lib/defaults'));
    config.appName = undefined;
    assert.equal(false, config.isValid());
    config.appName = '';
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains invalid characters', function(){
    let config = new Config(require('../lib/defaults'));
    config.appName = "wibble%";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains too many characters', function(){
    let config = new Config(require('../lib/defaults'));
    config.appName = "ThisIsAReallyLongNameButIsItLongEnoughNotQuiteSoLetsKeepGoing";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the artifactId contains invalid characters', function(){
    let config = new Config(require('../lib/defaults'));
    config.artifactId = "%wibble";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the groupId contains invalid characters', function(){
    let config = new Config(require('../lib/defaults'));
    config.groupId = "%wibble";
    assert.equal(false, config.isValid());
  });
});

describe('Config file processing', function() {
  it('it should find the control file in the root', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config")];
    config.processProject(templatePath);
    assert(config.configFiles);
    assert.equal(config.configFiles.length, 1);
    assert.equal(config.configFiles[0], path.resolve(templatePath[0], CONFIG_FILE));
  });
  it('it should support not having a config file in a directory', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/without-config")];
    config.processProject(templatePath);
    assert(config.configFiles);
    assert.equal(config.configFiles.length, 1);
    assert.equal(config.configFiles[0], path.resolve(templatePath[0], CONFIG_FILE));
  });
  it('it should add the config into the config.properties object', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/without-config")];
    config.processProject(templatePath);
    assert.equal(config.properties[0].name, 'testName');
    assert.equal(config.properties[0].value, 'testValue');
  });
  it('it should add the properties from all config files', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/with-other-config")];
    config.processProject(templatePath);
    let properties = [config.properties[0].name + "=" + config.properties[0].value];
    for(let i = 1; i < config.properties.length; i++) {
      properties.push(config.properties[i].name + "=" + config.properties[i].value);
    }
    assert.equal(properties.length, 2)
    assert(properties.includes('testName=testValue'), 'properties=' + properties);
    assert(properties.includes('testOtherName=testOtherValue'), 'properties=' + properties);
  });
  it('it should set alternative Gradle names and values when the build type is Gradle', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-gradle-config")];
    config.buildType = 'gradle';
    config.processProject(templatePath);
    let properties = [config.properties[0].name + "=" + config.properties[0].value];
    for(let i = 1; i < config.properties.length; i++) {
      properties.push(config.properties[i].name + "=" + config.properties[i].value);
    }
    assert.equal(properties.length, 2)
    assert(properties.includes('testGradleName1=testValue1'), 'properties=' + properties);
    assert(properties.includes('testName2=testGradleValue2'), 'properties=' + properties);
  });
  it('it should add the dependencies into the config.dependencies object', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config")];
    config.processProject(templatePath);
    assert.equal(config.dependencies[0].groupId, 'test.group.id');
    assert.equal(config.dependencies[0].artifactId, 'testArtifactId');
    assert.equal(config.dependencies[0].version, '0.0.1');
    assert.equal(config.dependencies[0].scope, 'provided');
  });
  it('it should add the dependencies from all config files', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/with-other-config")];
    config.processProject(templatePath);
    let dependencies = [config.dependencies[0].groupId + ":" + config.dependencies[0].artifactId + ":" + config.dependencies[0].version + ":" + config.dependencies[0].scope];
    for(let i = 1; i < config.dependencies.length; i++) {
      dependencies.push(config.dependencies[i].groupId + ":" + config.dependencies[i].artifactId + ":" + config.dependencies[i].version + ":" + config.dependencies[i].scope);
    }
    assert.equal(dependencies.length, 2)
    assert(dependencies.includes('test.group.id:testArtifactId:0.0.1:provided'), 'dependencies=' + dependencies);
    assert(dependencies.includes('test.other.group.id:testOtherArtifactId:0.0.2:provided'), 'dependencies=' + dependencies);
  });
  it('it should add the framework dependencies to the config.frameworkDependencies object', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config")];
    config.processProject(templatePath);
    assert(config.frameworkDependencies)
    assert.equal(config.frameworkDependencies[0].feature, 'testFrameworkDep-1.0');
  });
  it('it should add the framework dependencies from all config files', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/with-other-config")];
    config.processProject(templatePath);
    let dependencies = [config.frameworkDependencies[0].feature];
    for(let i = 1; i < config.frameworkDependencies.length; i++) {
      dependencies.push(config.frameworkDependencies[i].feature);
    }
    assert.equal(dependencies.length, 2)
    assert(dependencies.includes('testFrameworkDep-1.0'), 'dependencies=' + dependencies);
    assert(dependencies.includes('testOtherFrameworkDep-1.0'), 'dependencies=' + dependencies);
  });
  it('should throw an exception for an unrecognised entry in config.js', function() {
    let config = new Config();
    let templatePath = [path.resolve("./test/resources/config/with-invalid-config")];
    assert.throws(() => {config.processProject(templatePath)}, 'Did not throw an exception for an unknown config entry');
  });
  it('should be possible to update the config and have processing see the updates', function() {
    let config = new Config(require('../lib/defaults'));
    let templatePath = [path.resolve("./test/resources/config/with-dependent-config")];
    config.deployType = 'customDeploy';
    config.processProject(templatePath);
    assert.equal(config.properties[0].name, 'testName');
    assert.equal(config.properties[0].value, 'testValue');
  });

});
