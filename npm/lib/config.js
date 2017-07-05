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

//configuration module for controlling the template creation.

var fs = require('fs');
var fspath = require('path');
var Handlebars = require('./helpers.js').handlebars;

const logger = require('./log');

const PATTERN_NAME = new RegExp("^[a-zA-Z0-9_-]+$");
const PATTERN_ARTIFACT_ID = new RegExp("^[a-zA-Z0-9-_.]*$");
const CONFIG_FILE = "config.js";

Config.prototype.isValid = function() {
  var value = this.appName;
  if(!value || !PATTERN_NAME.test(value) || (value.length > 50)) return false;
  value = this.artifactId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  value = this.groupId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  return true;
}

Config.prototype.reset = function() {
  var defaultValues = this.defaults.get();
  for(var i = 0; i < defaultValues.length; i++) {
    var defaultValue = defaultValues[i];
    this[defaultValue] = this.defaults.get(defaultValue);
  }
  this.configFiles = [];
}

Config.prototype.overwrite = function(options) {
  //clone any property, only if it is already present in the target object
  for (var prop in this) {
    if (this.hasOwnProperty(prop)) {
        if(options[prop]) {
          this[prop] = options[prop];
        }
    }
  }
}

Config.prototype.addMissing = function(options, defaults) {
  //add properties that are not currently present and have matching default values, do not overwrite existing
  if(defaults == undefined) {
    throw new Error('addMissing expects defaults to be a defined');
  }
  defaults.get().forEach(key => {
    if(this[key] === undefined) {
      this[key] = options[key] || defaults.get(key);
    }
  });
}

Config.prototype.addDependencies = function(deps) {
  if(deps) {
    //merge an array of dependencies into the internal config object
    deps.forEach(dep => {
      //see if there is a conflict with existing deps
      var found = false;
      this.dependencies.forEach(existing => {
        if((existing.groupId === dep.groupId) && (existing.artifactId === dep.artifactId)) {
          //groupId and artifactId match, so need to check other details
          if((existing.version === dep.version) && (existing.scope === dep.scope)) {
            found = true;
            return;   //exact duplicates are fine, so stop checking
          }
          throw 'Dependency conflict, existing : ' + JSON.stringify(existing) + ', new : ' + JSON.stringify(dep);
        }
      });
      if (!found) this.dependencies.push(dep);
    });
  }
  return this.dependencies;
}

Config.prototype.addFrameworkDependencies = function(deps) {
  if(deps) {
    //merge an array of dependencies into the internal config object
    deps.forEach(dep => {
      var found = false;
      //see if there is a conflict with existing deps
      this.frameworkDependencies.forEach(existing => {
        var f1 = existing.feature.split('-');
        var f2 = dep.feature.split('-');
        if(f1[0] === f2[0]) {
          //feature name matches so need to check other details
          if(f1[1] === f2[1]) {
            found = true;
            return;   //exact version duplicates are fine, so stop checking
          }
          throw 'Framework dependency conflict, existing : ' + JSON.stringify(existing) + ', new : ' + JSON.stringify(dep);
        }
      });
      if(!found) this.frameworkDependencies.push(dep);
    });
  }
  return this.frameworkDependencies;
}

Config.prototype.addKeyValue = (entries, values) => {
  if(entries) {
    entries.forEach(entry => {
      var found = false;
      //see if there is a conflict with existing entry
      values.forEach(existing => {
        if(existing.name === entry.name) {
          //names match so have to check the values
          if(existing.value === entry.value) {
            found = true;
            return;   //exact duplicates are fine, so stop checking
          }
          throw 'Entry conflict, existing : ' + JSON.stringify(existing) + ', new : ' + JSON.stringify(entry);
        }
      });
      if(!found) values.push(entry);
    });
  }
  return values;
}

function Config(defaults) {
  this.defaults = defaults || { get : ()=>[]};
  this.dependencies = [];
  this.envEntries = [];
  this.jndiEntries = [];
  this.properties = [];
  this.frameworkDependencies = [];

  this.addProperties = (entries) => {;
    this.addKeyValue(entries, this.properties);
  }

  this.addJndiEntries = (entries) => {
    this.addKeyValue(entries, this.jndiEntries);
  }

  this.addEnvEntries = (entries) => {
    this.addKeyValue(entries, this.envEntries);
  }

  this.processProject = function(paths) {
    for(var i = 0; i < paths.length; i++) {
      var file = fspath.resolve(paths[i], CONFIG_FILE);
      logger.writeToLog('Processing config file ' + file + ' with config', this);
      if(fs.existsSync(file)) {
        this.configFiles.push(file);
      }
    }
    for(var i = 0; i < this.configFiles.length; i++) {
      var template = fs.readFileSync(this.configFiles[i], 'utf8');
      var compiledTemplate = Handlebars.compile(template);
      var output = compiledTemplate(this);
      try {
        var fileContent = eval("(" + output + ")");
        for(var array in fileContent) {
          var data = fileContent[array];
          if (!Array.isArray(data)) {
            throw 'Data is not an array, it is ' + JSON.stringify(data);
          }
          if(!this[array]) {
            throw array + ' is not a recognised array';
          }
          var name = array.charAt(0).toUpperCase() + array.substr(1);
          var func = this['add' + name].bind(this);
          if(func) {
            func(data);
          } else {
            throw 'Internal error - no matching function for [add' + name + ']';
          }
        }
      } catch(err) {
        console.error('Error reading ' + this.configFiles[i] + ' : ' + err);
        console.error('code : ' + output);
        throw err;
      }
    }
  }

  this.reset();
};    //the configuration object

module.exports = exports = Config;
