import React from 'react';
import get from 'lodash/get';

class Lang {
    /**
     * Translation store.
     *
     * @type {Object}
     *
     * @private
     */
    _translations = {};

    /**
     * Application locale.
     *
     * @type {String}
     *
     * @private
     */
    _locale;

    /**
     * Set application locale.
     *
     * @param {String} locale
     */
    setLocale(locale) {
        this._locale = locale;
    }

    /**
     * Get translations by locale.
     *
     * @return {Object}
     */
    translations() {
        return this._translations[this._locale];
    }

    /**
     * Get value for a given key from translation store.
     *
     * @param {String} key - configuration key to return value for
     * @param {Object} params - parameters
     *
     * @return {String|Array}
     *
     * @example
     * Lang.get('app.base.title'); // Frontend Starter Kit
     * Lang.get('app.base.hello', { name: 'Alfred' }); // Hello, Alfred!
     * Lang.get('app.base.description'); // If key did't exists: lang::app.base.description
     *
     * @public
     */
    get(key, params = {}) {
        const compiledKey = get(this.translations(), key);

        if (!compiledKey) {
            return `lang::${key}`;
        }

        const {
            hasReactParams,
            transformedParams
        } = this._transformReactComponentsToStrings(params);

        const string = compiledKey(transformedParams);

        if (!hasReactParams) {
            return string;
        }

        return this._transformToArray(string, params);
    }

    /**
     * Transform string to array to inject React Components.
     *
     * @param {String} string - translated string
     * @param {Object} params - parameters
     *
     * @returns {Array}
     *
     * @private
     */
    _transformToArray(string, params) {
        return string
            .split(/\$(ReactComponent:.*?)\$/g)
            .map((part) => {
                if (part.indexOf('ReactComponent:') !== 0) {
                    return part;
                }

                const paramName = part.substr('ReactComponent:'.length);

                return params[paramName];
            });
    }

    /**
     * Transform React Component to strings to insert React Markup into string.
     *
     * @param params - parameters
     *
     * @returns {{hasReactParams: Boolean, transformedParams: Object}}
     *
     * @private
     */
    _transformReactComponentsToStrings(params) {
        let hasReactParams = false;
        const transformedParams = {};

        Object.keys(params).forEach((paramName) => {
            if (React.isValidElement(params[paramName])) {
                hasReactParams = true;
                transformedParams[paramName] = `$ReactComponent:${paramName}$`;
            } else {
                transformedParams[paramName] = params[paramName];
            }
        });

        return {
            hasReactParams,
            transformedParams
        };
    }

    /**
     * Register translations.
     *
     * @param {Object} translations - translations object
     */
    register(translations) {
        this._translations = translations;
    }
}

export default new Lang();
