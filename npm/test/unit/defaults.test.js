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

// test the defaults module

var assert = require('assert');
var helpers = require('yeoman-test');
var defaultsModule = require('../../lib/defaults');
var path = require('path');

var defaults = new defaultsModule(require('../resources/defaults/defaults.js').getDefaults());

describe('Defaults module', function() {
  describe('Call getDefault to get the default object', function() {
    var appName = defaults.getObject('appName');
    var buildType = defaults.getObject('buildType');
    it('can get the default value', function() {
      assert.equal(appName.default, 'LibertyProject');
      assert.equal(buildType.default, 'maven');
    });
    it('can get the description', function() {
      assert.equal(appName.desc, 'Name of the application');
      assert.equal(buildType.desc, 'Build system to use');
    });
    it('can get the type', function() {
      assert.equal(appName.type, String);
      assert.equal(buildType.type, String);
    });
  });
  it('can use getDefaultValue to get the default value', function() {
    assert.equal(defaults.get('appName'), 'LibertyProject');
    assert.equal(defaults.get('buildType'), 'maven');
  });
  describe('Call getDefaults to get a list of config values with defaults', function() {
    var defaultValues = defaults.get();
    var foundAppName = false;
    var foundBuildType = false;
    for(var i = 0; i < defaultValues.length; i++) {
      if(defaultValues[i] === 'appName') {
        foundAppName = true;
      }
      if(defaultValues[i] === 'buildType') {
        foundBuildType = true;
      }
    }
    it('finds appName in the list of config values with defaults', function() {
      assert(foundAppName);
    });
    it('finds buildType in the list of config values with defaults', function() {
      assert(foundBuildType);
    });
  });
  describe('Call setOptions to expose the defaults as Yeoman options', function() {
    it('sets the defaults as options on the generator', function() {
      helpers.run(path.join(__dirname, '../resources/defaults'))
        .then(function() {
          assert.fileContent('options.txt', 'something')
        });
    });
  });
})
