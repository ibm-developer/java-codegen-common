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
'use strict'
// The context object to be passed to sub generators
const fspath = require('path');
const logger = require('./log');
const processor = require("./fsprocessor");
const Control = require('./control');
const extend = require('extend');
const Config = require("./config");
const Handlebars = require('./helpers').handlebars;


function Context(id, config, promptmgr) {
  this.id = id;
  this.logger = logger;
  this.processor = processor;
  this.promptmgr = promptmgr;
  this.conf = extend(new Config(), config);   //start with a copy of the parent generator's config
  this.conf.configFiles = [];                 //remove any previously set config files (don't want to inherit those)
  this.patterns = [];
  this.paths = [];
  this.comps = [];

  this.addCompositions = (values) => {
    this.comps = values;
  }

  this.configure = (generator) => {
    this.conf.templateRoot = generator.templatePath();
    var control = new Control(fspath.resolve(this.conf.templateRoot, this.conf.createType), this.conf);
    this.paths = control.getComposition();
    this.comps.forEach(composition => {
      this.paths.push(fspath.resolve(this.conf.templateRoot, composition));
    });
    this.conf.processProject(this.paths);
    generator.destinationRoot(this.conf.projectPath);
  };

  this.defaultWriter = (generator) => {
    if(!this.paths.length) {
      return;   //not being written by us
    }
    this.logger.writeToLog("Destination path", generator.destinationRoot());
    this.logger.writeToLog("Processor", this.processor);
    return this.processor.scan(this.conf, (relativePath, template) => {
      var outFile = generator.destinationPath(relativePath);
      this.logger.writeToLog("CB : writing to", outFile);
      try {
        var compiledTemplate = Handlebars.compile(template);
        var output = compiledTemplate(this.conf);
        generator.fs.write(outFile, output);
      } catch (err) {
        this.logger.writeToLog("Template error : " + relativePath, err.message);
      }
    }, this.paths);
  }
}

module.exports = exports = Context;
