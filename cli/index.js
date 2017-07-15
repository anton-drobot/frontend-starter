import get from 'lodash/get';
import bindAll from 'lodash/bindAll';
import path from 'path';
import glob from 'glob';
import prog from 'caporal';
import CatLog from 'cat-log';
import Validator from '../framework/Validation/Validator';
import { InvalidArgumentException } from '../framework/Exceptions';

/**
 * @todo add custom error messages.
 */
export default class CommandLineInterface {
    _logger = new CatLog('cli');

    _cli = prog
        .version('1.0.0')
        .description('CLI for frontend-starter')
        .logger(this._logger);

    _rules = {
        common: {
            command: {
                name: 'required|alpha_dash',
                description: 'required'
            },
            arguments: 'array',
            options: 'array',
            action: 'required|function',
            alias: 'alpha_dash',
            completer: 'function'
        },
        argument: {
            synopsis: 'required',
            description: 'required'
        },
        option: {
            synopsis: 'required',
            description: 'required'
        }
    };

    _validators = {
        common: new Validator(this._rules.common),
        argument: new Validator(this._rules.argument),
        option: new Validator(this._rules.option)
    };

    _errorMessages = [];

    constructor() {
        bindAll(this, [
            '_registerMethod',
            '_registerArgument',
            '_registerOption'
        ]);

        this._boot();

        if (this._errorMessages.length) {
            this._logger.error(this._errorMessages);
            throw InvalidArgumentException.invalidParameter('Invalid CLI method parameters');
        }

        prog.parse(process.argv);
    }

    _boot() {
        const methods = this._getMethods();
        methods.forEach(this._registerMethod);
    }

    /**
     * Get CLI methods names.
     *
     * @return {Array}
     *
     * @private
     */
    _getMethods() {
        const methods = [];
        const directories = glob.sync('cli/*/');

        directories.forEach((directory) => {
            directory = directory.slice(0, -1);
            methods.push(directory.substr(directory.lastIndexOf(path.sep) + 1));
        });

        return methods;
    }

    _registerMethod(methodName) {
        const method = require(`./${methodName}`);
        this._validators.common.validate(method.command);

        if (this._validators.common.passes()) {
            this._cli = this._cli.command(method.command.name, method.command.description);
            this._cli = this._cli.action(method.action);

            if (method.alias) {
                this._cli = this._cli.alias(method.alias);
            }

            if (method.completer) {
                this._cli = this._cli.complete(method.completer);
            }

            if (method.arguments) {
                method.arguments.forEach(this._registerArgument);
            }

            if (method.options) {
                method.options.forEach(this._registerOption);
            }
        } else {
            this._errorMessages.concat(this._validators.common.messages());
        }
    }

    _registerArgument(argument) {
        this._validators.argument.validate(argument);

        if (this._validators.argument.passes()) {
            this._cli = this._cli.option(
                argument.synopsis,
                argument.description,
                get('option.validation', null),
                get('option.default', null)
            );
        } else {
            this._errorMessages.concat(this._validators.argument.messages());
        }
    }

    _registerOption(option) {
        this._validators.option.validate(option);

        if (this._validators.option.passes()) {
            this._cli = this._cli.option(
                option.synopsis,
                option.description,
                get('option.validation', null),
                get('option.default', null),
                get('option.required', false)
            );
        } else {
            this._errorMessages.concat(this._validators.option.messages());
        }
    }
}
