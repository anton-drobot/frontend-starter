import get from 'lodash/get';
import trim from 'lodash/trim';

/**
 * @todo: Complete all validation functions
 * after (all), before (all), date (all), confirmed, distinct, inArray, ip, json, MIME (all),
 * regex, required (all, except "required"), timezone, url
 */
export default class Validations {
    /**
     * Get the size of an attribute.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Number}
     */
    _getSize(path, value)
    {
        if (this.validateNumeric(path, value)) {
            return parseFloat(value);
        }

        return value.length;
    }

    /**
     * Validate that an attribute was "accepted".
     *
     * This validation rule implies the attribute is "required".
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateAccepted(path, value) {
        const acceptable = ['yes', 'on', '1', 1, true, 'true'];

        return this.validateRequired(path, value) && acceptable.includes(value);
    }

    /**
     * Validate that an attribute contains only alphabetic characters.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateAlpha(path, value) {
        return (
            Object.prototype.toString.call(value) === '[object String]'
            && /^(?![\d_])\w+$/.test(value)
        );
    }

    /**
     * Validate that an attribute contains only alpha-numeric characters, dashes, and underscores.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateAlphaDash(path, value) {
        const tag = Object.prototype.toString.call(value);

        return (
            (tag === '[object String]' || tag === '[object Number]')
            && /^[\w-]+$/.test(value)
        );
    }

    /**
     * Validate that an attribute contains only alpha-numeric characters.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateAlphaNum(path, value) {
        const tag = Object.prototype.toString.call(value);

        return (
            (tag === '[object String]' || tag === '[object Number]')
            && /^(?!_)\w+$/.test(value)
        );
    }

    /**
     * Validate that an attribute is an array.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateArray(path, value) {
        return Array.isArray(value);
    }

    /**
     * Validate the size of an attribute is between a set of values.
     *
     * @param {String} path
     * @param {*} value
     * @param {Number} min
     * @param {Number} max
     *
     * @return {Boolean}
     */
    validateBetween(path, value, min, max) {
        const size = this._getSize(path, value);

        return size >= min && size <= max;
    }

    /**
     * Validate that an attribute is a boolean.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateBoolean(path, value) {
        const acceptable = [true, false, 0, 1, '0', '1'];

        return acceptable.includes(value);
    }

    /**
     * Validate that an attribute is different from another attribute.
     *
     * @param {String} path
     * @param {*} value
     * @param {String} anotherPath
     *
     * @return {Boolean}
     */
    validateDifferent(path, value, anotherPath) {
        const anotherValue = get(this._data, anotherPath);

        return value !== anotherValue;
    }

    /**
     * Validate that an attribute has a given number of digits.
     *
     * @param {String} path
     * @param {*} value
     * @param {Number} length
     *
     * @return {Boolean}
     */
    validateDigits(path, value, length) {
        return /^\d+$/.test(value) && value.length === length;
    }

    /**
     * Validate that an attribute has a given number of digits.
     *
     * @param {String} path
     * @param {*} value
     * @param {Number} min
     * @param {Number} max
     *
     * @return {Boolean}
     */
    validateDigitsBetween(path, value, min, max) {
        return /^\d+$/.test(value) && value.length >= min && value.length <= max;
    }

    /**
     * Validate that an attribute is a valid e-mail address.
     *
     * @see http://emailregex.com/
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateEmail(path, value) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    /**
     * Validate the given attribute is filled if it is present.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateFilled(path, value)
    {
        if (get(this._data, path) !== undefined) {
            return this.validateRequired(path, value);
        }

        return true;
    }

    /**
     * Validate an attribute is contained within a list of values.
     *
     * @param {String} path
     * @param {*} value
     * @param {*[]} items
     *
     * @return {Boolean}
     */
    validateIn(path, value, ...items) {
        return items.includes(value);
    }

    /**
     * Validate that an attribute is an integer.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateInteger(path, value) {
        return (
            Object.prototype.toString.call(value) === '[object Number]'
            && Number.isFinite(value)
            && !(value % 1)
        );
    }

    /**
     * Validate the size of an attribute is less than a maximum value.
     *
     * @param {String} path
     * @param {*} value
     * @param {Number} max
     *
     * @return {Boolean}
     */
    validateMax(path, value, max) {
        return this._getSize(path, value) <= max;
    }

    /**
     * Validate the size of an attribute is greater than a minimum value.
     *
     * @param {String} path
     * @param {*} value
     * @param {Number} min
     *
     * @return {Boolean}
     */
    validateMin(path, value, min) {
        return this._getSize(path, value) >= min;
    }

    /**
     * "Indicate" validation should pass if value is null.
     *
     * Always returns true, just lets us put "nullable" in rules.
     *
     * @return {Boolean}
     */
    validateNullable() {
        return true;
    }

    /**
     * Validate an attribute is not contained within a list of values.
     *
     * @param {String} path
     * @param {*} value
     * @param {*[]} items
     *
     * @return {Boolean}
     */
    validateNotIn(path, value, ...items) {
        return !this.validateIn(path, value, ...items);
    }

    /**
     * Validate that an attribute is numeric.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateNumeric(path, value) {
        const tag = Object.prototype.toString.call(value);

        return (
            tag === '[object Number]'
            || (
                tag === '[object String]'
                && trim(value) !== ''
                && !isNaN(value)
            )
        );
    }

    /**
     * Validate that an attribute exists even if not filled.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validatePresent(path, value) {
        return get(this._data, path) !== undefined;
    }

    /**
     * Validate that a required attribute exists.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateRequired(path, value) {
        return !(
            value === null
            || (Object.prototype.toString.call(value) === '[object String]' && trim(value) === '')
            || (Array.isArray(value) && value.length === 0)
        );
    }

    /**
     * Validate that two attributes match.
     *
     * @param {String} path
     * @param {*} value
     * @param {String} anotherPath
     *
     * @return {Boolean}
     */
    validateSame(path, value, anotherPath) {
        const anotherValue = get(this._data, anotherPath);

        return value === anotherValue;
    }

    /**
     * Validate that an attribute is a string.
     *
     * @param {String} path
     * @param {*} value
     *
     * @return {Boolean}
     */
    validateString(path, value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
}
