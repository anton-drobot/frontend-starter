import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import Validations from '../Validations';
import { traits } from '../../../libs/traits';

@traits(Validations)
export default class Validator {
    /**
     * The validation rules that imply the field is required.
     *
     * @type {Array}
     *
     * @private
     */
    _implicitRules = [
        'required', 'filled', 'accepted', 'present'
    ];

    /**
     * The initial rules provided.
     *
     * @type {Object}
     *
     * @private
     */
    _initialRules = {};

    /**
     * The rules to be applied to the data.
     *
     * @type {Object}
     *
     * @private
     */
    _rules = {};

    /**
     * The data under validation.
     *
     * @type {Object}
     *
     * @private
     */
    _data = {};

    /**
     * The object of custom error messages.
     *
     * @type {Object}
     * @private
     */
    _messages = {};

    /**
     * The array of failure messages.
     *
     * @type {Array}
     * @private
     */
    _failureMessages = [];

    constructor(rules, messages = {}) {
        this._initialRules = rules;
        this._messages = messages;

        this._setRules(rules);
    }

    /**
     * We'll spin through each rule, validating the attributes attached to that rule.
     * Any error messages will be added to the containers with each of the other error messages,
     * returning true if we don't have messages.
     *
     * @param data
     *
     * @return {Validator}
     */
    validate(data) {
        this._data = data;
        this._failureMessages = [];

        this._applyRecursively(this._rules, (rules, path) => {
            this._validateAttribute(path, get(data, path), rules);
        });

        return this;
    }

    /**
     * Determine if the data passes the validation rules.
     *
     * @return {Boolean}
     */
    passes() {
        return !this._failureMessages.length;
    }

    /**
     * Determine if the data fails the validation rules.
     *
     * @return {Boolean}
     */
    fails() {
        return !this.passes();
    }

    /**
     * Get the failure messages.
     *
     * @return {Array}
     */
    messages() {
        return this._failureMessages;
    }

    /**
     * Determine if the given attribute has a rule in the given set.
     *
     * @param {String} path
     * @param {String} rule
     * 
     * @return {Boolean}
     */
    hasRule(path, rule) {
        const rules = get(this._rules, path, []);

        return rules.some((item) => item[0] === rule);
    }

    /**
     * Set the validation rules.
     *
     * @param {Object} initialRules
     *
     * @private
     */
    _setRules(initialRules) {
        this._rules = this._applyRecursively(initialRules, (value) => {
            return (Array.isArray(value)) ?
                value.map(this._convertRule) :
                value.split('|').map(this._convertRule);
        });
    }

    /**
     * Parse the given rule.
     *
     * @param {String} rule
     *
     * @return {[String,*[]]}
     *
     * @private
     */
    _convertRule(rule) {
        const [name, argsString] = rule.split(':');
        const args = argsString ? argsString.split(',') : [];

        return [name, args];
    }

    /**
     * Determine if the attribute is validatable.
     *
     * @param {String} path
     * @param {*} value
     * @param {String} rule
     *
     * @return {Boolean}
     *
     * @private
     */
    _isValidatable(path, value, rule) {
        return (
            this._presentOrRuleIsImplicit(path, value, rule) &&
            this._isNotNullIfMarkedAsNullable(path, rule)
        );
    }

    /**
     * Determine if the field is present, or the rule implies required.
     *
     * @param {String} path
     * @param {*} value
     * @param {String} rule
     *
     * @return {Boolean}
     */
    _presentOrRuleIsImplicit(path, value, rule) {
        if (Object.prototype.toString.call(get(this._data, path)) === '[object String]' && value.trim() === '') {
            return this._isImplicit(rule);
        }

        return this.validatePresent(path, value) || this._isImplicit(rule);
    }

    /**
     * Determine if a given rule implies the attribute is required.
     *
     * @param {String} rule
     *
     * @return {Boolean}
     */
    _isImplicit(rule) {
        return this._implicitRules.includes(rule);
    }

    /**
     * Determine if the attribute fails the nullable check.
     *
     * @param {String} rule
     * @param {String} path
     *
     * @return {Boolean}
     *
     * @private
     */
    _isNotNullIfMarkedAsNullable(path, rule) {
        if (this._isImplicit(rule) || !this.hasRule(path, 'nullable')) {
            return true;
        }

        return get(this._data, path, null) !== null;
    }

    /**
     * Validate a given attribute against a rule.
     *
     * @param {String} path
     * @param {*} value
     * @param {Array} rules
     *
     * @private
     */
    _validateAttribute(path, value, rules) {
        rules.forEach(([rule, args]) => {
            const isValidatable = this._isValidatable(path, value, rule);

            if (isValidatable) {
                const isValid = this[`validate${upperFirst(camelCase(rule))}`](path, value, ...args);

                if (!isValid) {
                    this._addFailure(path, rule);
                }
            }
        });
    }

    /**
     * @todo Сделать, чтобы можно было передавать не строку, а функцию перевода.
     * Чтобы можно было передавать название аттрибута, его значение, правило и аргументы.
     *
     * @param {String} path
     * @param {String} rule
     *
     * @private
     */
    _addFailure(path, rule) {
        const rulePath = `${path}.${rule}`;
        const message = get(this._messages, rulePath, get(this._messages, rule, rulePath));
        this._failureMessages.push(message);
    }

    _applyRecursively(obj, callback) {
        return this._applyRecursivelyHelper(obj, callback, []);
    }

    _applyRecursivelyHelper(obj, callback, path) {
        const newObj = {};

        Object.keys(obj).forEach((key) => {
            const currentPath = path.concat(key);

            newObj[key] = (Object.prototype.toString.call(obj[key]) === '[object Object]') ?
                this._applyRecursivelyHelper(obj[key], callback, currentPath) :
                callback(obj[key], currentPath.join('.'));
        });

        return newObj;
    }
}
