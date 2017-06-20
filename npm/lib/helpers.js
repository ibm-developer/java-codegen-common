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

//module for Handlebars helpers

var Handlebars = require('handlebars');

//allow slightly more sophisticated inclusion by checking the value of a property, not just it's presence or absence
Handlebars.registerHelper('has', function(context, options, handler) {
  var found = Array.isArray(context) ? context.includes(options) : (context === options);
  //see if the current context matches the options passed in
  if (found) {
    var data = Handlebars.createFrame(handler.data);
    return handler.fn(handler.data.root, {data : data, blockParams : [handler.data.root]});
  }
  //parameters didn't match, so don't render anything in the template
  return undefined;
});

//allow slightly more sophisticated exclusion by checking the value of a property, not just it's presence or absence
Handlebars.registerHelper('missing', function(context, options, handler) {
  var missing = Array.isArray(context) ? !context.includes(options) : (context != options);
  //see if the current context matches the options passed in
  if (missing) {
    var data = Handlebars.createFrame(handler.data);
    //pass back contents as is for processing, rather than the data that is passed as the context
    return handler.fn(handler.data.root, {data : data, blockParams : [handler.data.root]});
  }
  //parameters matched, so don't render anything in the template
  return undefined;
});

//convert tag contents to lower case
Handlebars.registerHelper('toLowerCase', function(context) {
  return String(context).toLowerCase();
});

//convert tag contents to upper case
Handlebars.registerHelper('toUpperCase', function(context) {
  return String(context).toUpperCase();
});

Handlebars.registerHelper('firstAvailable', function() {
  for(var i=0; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      return arguments[i];
    }
  }
  return "undefined";
});

module.exports = {
  handlebars : Handlebars
}
