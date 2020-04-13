'use strict';

var core = require('@actions/core');
var os = require('os');
var chalk = require('chalk');
var github = require('@actions/github');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var NAME = '[funny-deploy]';
var infoWrap = chalk.bold.green;
var warnWrap = chalk.keyword('orange');
var errorWrap = chalk.bold.red;
function info(message) {
    var arguments$1 = arguments;

    var arg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        arg[_i - 1] = arguments$1[_i];
    }
    var msg = NAME + ": " + message + " " + os.EOL;
    msg = infoWrap(msg);
    console.log.apply(console, __spreadArrays([msg], arg));
}
function warn(message) {
    var arguments$1 = arguments;

    var arg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        arg[_i - 1] = arguments$1[_i];
    }
    var msg = NAME + "::Warn:: " + message + " " + os.EOL;
    msg = warnWrap(msg);
    console.warn.apply(console, __spreadArrays([msg], arg));
}
function error(message) {
    var arguments$1 = arguments;

    var arg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        arg[_i - 1] = arguments$1[_i];
    }
    var msg = NAME + "::Error:: " + message + " " + os.EOL;
    var msgWrap = errorWrap(msg);
    console.error.apply(console, __spreadArrays([msgWrap], arg));
    core.setFailed(msg);
}
var log = {
    info: info,
    warn: warn,
    error: error,
};

function deploy () {
    // init
    try {
        // 1. get input
        log.info('get input begin');
        // `who-to-greet` input defined in action metadata file
        var nameToGreet = core.getInput('who-to-greet');
        log.info("Hello " + nameToGreet + "!");
        var time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        var payload = JSON.stringify(github.context.payload, undefined, 2);
        log.warn("The event payload: " + payload);
        // 2. validate input
        // 3. connet ssh
        // 4. put file
        // successs
    }
    catch (err) {
        log.error(err);
    }
}

deploy();
//# sourceMappingURL=index.js.map
