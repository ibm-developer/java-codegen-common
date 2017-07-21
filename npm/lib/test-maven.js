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

 /* Tests for maven */

'use strict'

var assert = require('yeoman-assert');
const BUILD_FILE = 'pom.xml'

function test_maven() {
}

test_maven.prototype.assertApplication = function(appname, groupId, artifactId, version) {
  it('does not generate a build.gradle', function() {
    assert.noFile('build.gradle');
  });
  it('does not generate a settings.gradle', function() {
    assert.noFile('settings.gradle');
  });
  it('generates a ' + BUILD_FILE + ' file with correct application name, groupId, artifactId and version', function() {
    assert.file(BUILD_FILE);
    assert.fileContent(BUILD_FILE,"<app.name>" + appname + "</app.name>");
    assert.fileContent(BUILD_FILE,"<groupId>" + groupId + "</groupId>");
    assert.fileContent(BUILD_FILE,"<artifactId>" + artifactId + "</artifactId>");
    assert.fileContent(BUILD_FILE,"<version>" + version + "</version>");
  });
}

test_maven.prototype.assertBluemix = function(appname) {
  it('manifest.yml contains a path to a zip file with the same name as the application (' + appname + ')'), function() {
    assert.fileContent('manifest.yml', 'path: ./target/' + appname + '.zip');
  }
}

test_maven.prototype.assertProperty = function(name, value) {
  it(BUILD_FILE + ' contains a property called ' + name + ' with a value of ' + value, function() {
    assert.fileContent(BUILD_FILE, '<' + name + '>' + value + '</' + name + '>');
  });
}

test_maven.prototype.assertContent = function(value) {
  it(BUILD_FILE + ' contains file content ' + value, function() {
    assert.fileContent(BUILD_FILE, value);
  });
}

test_maven.prototype.assertNoContent = function(value) {
  it(BUILD_FILE + ' does not contain file content ' + value, function() {
    assert.noFileContent(BUILD_FILE, value);
  });
}

test_maven.prototype.assertDependency = function(scope, groupId, artifactId, version, exclusions) {
  it(BUILD_FILE + ' contains a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    assert.fileContent(BUILD_FILE, constructRegex(scope, groupId, artifactId, version, exclusions));
  });
}

test_maven.prototype.assertNoDependency = function(scope, groupId, artifactId, version, exclusions) {
  it(BUILD_FILE + ' does not contain a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    assert.noFileContent(BUILD_FILE, constructRegex(scope, groupId, artifactId, version, exclusions));
  });
}

test_maven.prototype.getCompileCommand = function() {
  return 'mvn test-compile'; //compiles the main and test classes
}

test_maven.prototype.getBuildCommand = function() {
  return 'mvn install'; //full build
}

var constructRegex = function(scope, groupId, artifactId, version, exclusions) {
  groupId = groupId.replace(/\./g, '\\.');
  artifactId = artifactId.replace(/\./g, '\\.');
  var content = '<dependency>\\s*<groupId>' + groupId + '</groupId>\\s*<artifactId>' + artifactId + '</artifactId>';
  if(version) {
    version = version.replace(/\./g, '\\.');
    content += '\\s*<version>' + version + '</version>';
  }
  if(scope != 'compile') {
    content += '\\s*<scope>' + scope + '</scope>';
  }
  if(exclusions) {
    content += '\\s*<exclusions>';
    for(var i=0; i < exclusions.length; i++) {
      content += '\\s*<exclusion>\\s*<groupId>' + exclusions[i].groupId.replace(/\./g, '\\.') + '</groupId>\\s*<artifactId>' + exclusions[i].artifactId.replace(/\./g, '\\.') + '</artifactId>\\s*</exclusion>'
    }
    content += '\\s*</exclusions>';
  }
  return new RegExp(content);
}

module.exports = test_maven;
