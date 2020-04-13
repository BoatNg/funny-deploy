(function (os$1) {
    'use strict';

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

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __importStar = (undefined && undefined.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const command_1 = require("./command");
    const os = __importStar(require("os"));
    const path = __importStar(require("path"));
    /**
     * The code to exit an action
     */
    var ExitCode;
    (function (ExitCode) {
        /**
         * A code indicating that the action was successful
         */
        ExitCode[ExitCode["Success"] = 0] = "Success";
        /**
         * A code indicating that the action was a failure
         */
        ExitCode[ExitCode["Failure"] = 1] = "Failure";
    })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
    //-----------------------------------------------------------------------
    // Variables
    //-----------------------------------------------------------------------
    /**
     * Sets env variable for this action and future actions in the job
     * @param name the name of the variable to set
     * @param val the value of the variable
     */
    function exportVariable(name, val) {
        process.env[name] = val;
        command_1.issueCommand('set-env', { name }, val);
    }
    exports.exportVariable = exportVariable;
    /**
     * Registers a secret which will get masked from logs
     * @param secret value of the secret
     */
    function setSecret(secret) {
        command_1.issueCommand('add-mask', {}, secret);
    }
    exports.setSecret = setSecret;
    /**
     * Prepends inputPath to the PATH (for this action and future actions)
     * @param inputPath
     */
    function addPath(inputPath) {
        command_1.issueCommand('add-path', {}, inputPath);
        process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
    }
    exports.addPath = addPath;
    /**
     * Gets the value of an input.  The value is also trimmed.
     *
     * @param     name     name of the input to get
     * @param     options  optional. See InputOptions.
     * @returns   string
     */
    function getInput(name, options) {
        const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
        if (options && options.required && !val) {
            throw new Error(`Input required and not supplied: ${name}`);
        }
        return val.trim();
    }
    exports.getInput = getInput;
    /**
     * Sets the value of an output.
     *
     * @param     name     name of the output to set
     * @param     value    value to store
     */
    function setOutput(name, value) {
        command_1.issueCommand('set-output', { name }, value);
    }
    exports.setOutput = setOutput;
    //-----------------------------------------------------------------------
    // Results
    //-----------------------------------------------------------------------
    /**
     * Sets the action status to failed.
     * When the action exits it will be with an exit code of 1
     * @param message add error issue message
     */
    function setFailed(message) {
        process.exitCode = ExitCode.Failure;
        error(message);
    }
    exports.setFailed = setFailed;
    //-----------------------------------------------------------------------
    // Logging Commands
    //-----------------------------------------------------------------------
    /**
     * Gets whether Actions Step Debug is on or not
     */
    function isDebug() {
        return process.env['RUNNER_DEBUG'] === '1';
    }
    exports.isDebug = isDebug;
    /**
     * Writes debug message to user log
     * @param message debug message
     */
    function debug(message) {
        command_1.issueCommand('debug', {}, message);
    }
    exports.debug = debug;
    /**
     * Adds an error issue
     * @param message error issue message
     */
    function error(message) {
        command_1.issue('error', message);
    }
    exports.error = error;
    /**
     * Adds an warning issue
     * @param message warning issue message
     */
    function warning(message) {
        command_1.issue('warning', message);
    }
    exports.warning = warning;
    /**
     * Writes info to log with console.log.
     * @param message info message
     */
    function info(message) {
        process.stdout.write(message + os.EOL);
    }
    exports.info = info;
    /**
     * Begin an output group.
     *
     * Output until the next `groupEnd` will be foldable in this group
     *
     * @param name The name of the output group
     */
    function startGroup(name) {
        command_1.issue('group', name);
    }
    exports.startGroup = startGroup;
    /**
     * End an output group.
     */
    function endGroup() {
        command_1.issue('endgroup');
    }
    exports.endGroup = endGroup;
    /**
     * Wrap an asynchronous function call in a group.
     *
     * Returns the same type as the function itself.
     *
     * @param name The name of the group
     * @param fn The function to wrap in the group
     */
    function group(name, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            startGroup(name);
            let result;
            try {
                result = yield fn();
            }
            finally {
                endGroup();
            }
            return result;
        });
    }
    exports.group = group;
    //-----------------------------------------------------------------------
    // Wrapper action state
    //-----------------------------------------------------------------------
    /**
     * Saves state for current action, the state can only be retrieved by this action's post job execution.
     *
     * @param     name     name of the state to store
     * @param     value    value to store
     */
    function saveState(name, value) {
        command_1.issueCommand('save-state', { name }, value);
    }
    exports.saveState = saveState;
    /**
     * Gets the value of an state set by this action's main execution.
     *
     * @param     name     name of the state to get
     * @returns   string
     */
    function getState(name) {
        return process.env[`STATE_${name}`] || '';
    }
    exports.getState = getState;

    var core = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    const ansiStyles = require('ansi-styles');
    const {stdout: stdoutColor, stderr: stderrColor} = require('supports-color');
    const {
    	stringReplaceAll,
    	stringEncaseCRLFWithFirstIndex
    } = require('./util');

    // `supportsColor.level` → `ansiStyles.color[name]` mapping
    const levelMapping = [
    	'ansi',
    	'ansi',
    	'ansi256',
    	'ansi16m'
    ];

    const styles = Object.create(null);

    const applyOptions = (object, options = {}) => {
    	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    		throw new Error('The `level` option should be an integer from 0 to 3');
    	}

    	// Detect level if not set manually
    	const colorLevel = stdoutColor ? stdoutColor.level : 0;
    	object.level = options.level === undefined ? colorLevel : options.level;
    };

    class ChalkClass {
    	constructor(options) {
    		// eslint-disable-next-line no-constructor-return
    		return chalkFactory(options);
    	}
    }

    const chalkFactory = options => {
    	const chalk = {};
    	applyOptions(chalk, options);

    	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

    	Object.setPrototypeOf(chalk, Chalk.prototype);
    	Object.setPrototypeOf(chalk.template, chalk);

    	chalk.template.constructor = () => {
    		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
    	};

    	chalk.template.Instance = ChalkClass;

    	return chalk.template;
    };

    function Chalk(options) {
    	return chalkFactory(options);
    }

    for (const [styleName, style] of Object.entries(ansiStyles)) {
    	styles[styleName] = {
    		get() {
    			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
    			Object.defineProperty(this, styleName, {value: builder});
    			return builder;
    		}
    	};
    }

    styles.visible = {
    	get() {
    		const builder = createBuilder(this, this._styler, true);
    		Object.defineProperty(this, 'visible', {value: builder});
    		return builder;
    	}
    };

    const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

    for (const model of usedModels) {
    	styles[model] = {
    		get() {
    			const {level} = this;
    			return function (...arguments_) {
    				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
    				return createBuilder(this, styler, this._isEmpty);
    			};
    		}
    	};
    }

    for (const model of usedModels) {
    	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
    	styles[bgModel] = {
    		get() {
    			const {level} = this;
    			return function (...arguments_) {
    				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
    				return createBuilder(this, styler, this._isEmpty);
    			};
    		}
    	};
    }

    const proto = Object.defineProperties(() => {}, {
    	...styles,
    	level: {
    		enumerable: true,
    		get() {
    			return this._generator.level;
    		},
    		set(level) {
    			this._generator.level = level;
    		}
    	}
    });

    const createStyler = (open, close, parent) => {
    	let openAll;
    	let closeAll;
    	if (parent === undefined) {
    		openAll = open;
    		closeAll = close;
    	} else {
    		openAll = parent.openAll + open;
    		closeAll = close + parent.closeAll;
    	}

    	return {
    		open,
    		close,
    		openAll,
    		closeAll,
    		parent
    	};
    };

    const createBuilder = (self, _styler, _isEmpty) => {
    	const builder = (...arguments_) => {
    		// Single argument is hot path, implicit coercion is faster than anything
    		// eslint-disable-next-line no-implicit-coercion
    		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
    	};

    	// We alter the prototype because we must return a function, but there is
    	// no way to create a function with a different prototype
    	Object.setPrototypeOf(builder, proto);

    	builder._generator = self;
    	builder._styler = _styler;
    	builder._isEmpty = _isEmpty;

    	return builder;
    };

    const applyStyle = (self, string) => {
    	if (self.level <= 0 || !string) {
    		return self._isEmpty ? '' : string;
    	}

    	let styler = self._styler;

    	if (styler === undefined) {
    		return string;
    	}

    	const {openAll, closeAll} = styler;
    	if (string.indexOf('\u001B') !== -1) {
    		while (styler !== undefined) {
    			// Replace any instances already present with a re-opening code
    			// otherwise only the part of the string until said closing code
    			// will be colored, and the rest will simply be 'plain'.
    			string = stringReplaceAll(string, styler.close, styler.open);

    			styler = styler.parent;
    		}
    	}

    	// We can move both next actions out of loop, because remaining actions in loop won't have
    	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
    	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
    	const lfIndex = string.indexOf('\n');
    	if (lfIndex !== -1) {
    		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    	}

    	return openAll + string + closeAll;
    };

    let template;
    const chalkTag = (chalk, ...strings) => {
    	const [firstString] = strings;

    	if (!Array.isArray(firstString)) {
    		// If chalk() was called by itself or with a string,
    		// return the string itself as a string.
    		return strings.join(' ');
    	}

    	const arguments_ = strings.slice(1);
    	const parts = [firstString.raw[0]];

    	for (let i = 1; i < firstString.length; i++) {
    		parts.push(
    			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
    			String(firstString.raw[i])
    		);
    	}

    	if (template === undefined) {
    		template = require('./templates');
    	}

    	return template(chalk, parts.join(''));
    };

    Object.defineProperties(Chalk.prototype, styles);

    const chalk = Chalk(); // eslint-disable-line new-cap
    chalk.supportsColor = stdoutColor;
    chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
    chalk.stderr.supportsColor = stderrColor;

    module.exports = chalk;

    var chalk$1 = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var NAME = '[funny-deploy]';
    var infoWrap = undefined;
    var warnWrap = undefined('orange');
    var errorWrap = undefined;
    function info$1(message) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var msg = NAME + ": " + message + " " + os$1.EOL;
        msg = infoWrap(msg);
        console.log.apply(console, __spreadArrays([msg], arg));
    }
    function warn(message) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var msg = NAME + "::Warn:: " + message + " " + os$1.EOL;
        msg = warnWrap(msg);
        console.warn.apply(console, __spreadArrays([msg], arg));
    }
    function error$1(message) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var msg = NAME + "::Error:: " + message + " " + os$1.EOL;
        var msgWrap = errorWrap(msg);
        console.error.apply(console, __spreadArrays([msgWrap], arg));
        undefined(msg);
    }
    var log = {
        info: info$1,
        warn: warn,
        error: error$1,
    };

    var __importStar$1 = (undefined && undefined.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    // Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
    const graphql_1 = require("@octokit/graphql");
    const rest_1 = require("@octokit/rest");
    const Context = __importStar$1(require("./context"));
    const httpClient = __importStar$1(require("@actions/http-client"));
    // We need this in order to extend Octokit
    rest_1.Octokit.prototype = new rest_1.Octokit();
    exports.context = new Context.Context();
    class GitHub extends rest_1.Octokit {
        constructor(token, opts) {
            super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
            this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
        }
        /**
         * Disambiguates the constructor overload parameters
         */
        static disambiguate(token, opts) {
            return [
                typeof token === 'string' ? token : '',
                typeof token === 'object' ? token : opts || {}
            ];
        }
        static getOctokitOptions(args) {
            const token = args[0];
            const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
            // Auth
            const auth = GitHub.getAuthString(token, options);
            if (auth) {
                options.auth = auth;
            }
            // Proxy
            const agent = GitHub.getProxyAgent(options);
            if (agent) {
                // Shallow clone - don't mutate the object provided by the caller
                options.request = options.request ? Object.assign({}, options.request) : {};
                // Set the agent
                options.request.agent = agent;
            }
            return options;
        }
        static getGraphQL(args) {
            const defaults = {};
            const token = args[0];
            const options = args[1];
            // Authorization
            const auth = this.getAuthString(token, options);
            if (auth) {
                defaults.headers = {
                    authorization: auth
                };
            }
            // Proxy
            const agent = GitHub.getProxyAgent(options);
            if (agent) {
                defaults.request = { agent };
            }
            return graphql_1.graphql.defaults(defaults);
        }
        static getAuthString(token, options) {
            // Validate args
            if (!token && !options.auth) {
                throw new Error('Parameter token or opts.auth is required');
            }
            else if (token && options.auth) {
                throw new Error('Parameters token and opts.auth may not both be specified');
            }
            return typeof options.auth === 'string' ? options.auth : `token ${token}`;
        }
        static getProxyAgent(options) {
            var _a;
            if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
                const serverUrl = 'https://api.github.com';
                if (httpClient.getProxyUrl(serverUrl)) {
                    const hc = new httpClient.HttpClient();
                    return hc.getAgent(serverUrl);
                }
            }
            return undefined;
        }
    }
    exports.GitHub = GitHub;

    var github = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    function deploy () {
        // init
        try {
            // 1. get input
            log.info('get input begin');
            // `who-to-greet` input defined in action metadata file
            var nameToGreet = undefined('who-to-greet');
            log.info("Hello " + nameToGreet + "!");
            var time = (new Date()).toTimeString();
            undefined("time", time);
            // Get the JSON webhook payload for the event that triggered the workflow
            var payload = JSON.stringify(undefined, undefined, 2);
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

}(os$1));
