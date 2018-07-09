/*
 * © Copyright IBM Corp. 2017, 2018
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

//test the controller

'use strict';
const assert = require('assert');
const Control = require('../../lib/control');
const path = require('path');
const Config = require("../../lib/config");
const config = new Config(require('../lib/defaults'));

before(function () {
  config.templateRoot = path.resolve("./test/resources/control");
});

describe('control library', function () {
  describe('can create instances', function () {
    it('it should throw an exception if the path is missing', function () {
      assert.throws(() => {
        new Control()
      })
    });
    it('it should throw an exception if the config is missing', function () {
      assert.throws(() => {
        new Control("Path 1")
      })
    });
    it('it should be possible to have more than one instance of a control', function () {
      let control = new Control("Path 1", config);
      let control2 = new Control("Path 2", config);
      assert.equal(false, control.getPath() === control2.getPath());
    });
  });

  describe('can find a control file', function () {
    it('it should find the control.js file in the root', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(true, control.hasControl());
    });

    it('it should ignore any control.js file not found in the root', function () {
      config.templateFullPath = path.resolve("./test/resources/control/without-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(false, control.hasControl());
    });

    it('it should throw an exception when the contol.js file does not contain valid javascript', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-invalid-control");
      assert.throws(() => {
        new Control(config.templateFullPath, config)
      });
    });
  });

  describe('process a control file', function () {
    it('it should exclude a file in the file exclusion list', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(false, control.shouldGenerate("build.gradle"));
    });

    it('it should include any file not in the file exclusion list', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(true, control.shouldGenerate("somefile.txt"));
    });

    it('it should exclude a directory in the directory exclusion list', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(false, control.shouldGenerate("donotprocess/file1.txt"));
    });

    it('it should support a composition element', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      assert(Array.isArray(control.getComposition()));
      assert(control.getComposition()[0].includes("subTemplate"));
    });

    it('it should support not having a composition element', function () {
      config.templateFullPath = path.resolve("./test/resources/control/no-composition");
      let control = new Control(config.templateFullPath, config);
      assert(Array.isArray(control.getComposition()));
      assert.equal(0, control.getComposition().length);
    });
  });

  describe('process found files', function () {
    it('it should use a custom fileFound callback if defined', function () {
      config.templateFullPath = path.resolve("./test/resources/control/with-control");
      let control = new Control(config.templateFullPath, config);
      let fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "alteredpath");
    });

    it('it should use the default callback if no custom one is defined', function () {
      config.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      let control = new Control(config.templateFullPath, config);
      let fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "path");
    });
  });

  describe('generates file', function () {
    it('it should generate a file if a control block is not present', function () {
      config.templateFullPath = path.resolve("./test/resources/control/without-control");
      let control = new Control(config.templateFullPath, config);
      assert.equal(true, control.shouldGenerate());
    });

    it('it should generate a file if a control block present, but has no exclusions defined', function () {
      config.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      let control = new Control(config.templateFullPath, config);
      assert.equal(true, control.shouldGenerate());
    });
  });

});
