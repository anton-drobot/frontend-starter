import React from 'react';
import get from 'lodash/get';

import RuntimeException from '../../Exceptions/RuntimeException';

export default class Lang {
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
     * View component identifier.
     *
     * @type {String}
     *
     * @private
     */
    _VIEW_COMPONENT_ID = 'ViewComponent';

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
        if (!this._locale) {
            throw RuntimeException.missingLocale();
        }

        if (!this._translations[this._locale]) {
            throw RuntimeException.missingLocale(this._locale);
        }

        return this._translations[this._locale];
    }

    /**
     * Get value for a given key from translation store.
     *
     * @param {String} key - Configuration key to return value for.
     * @param {Object} params - Parameters.
     *
     * @return {String|Array} - An array when it has React-like Components.
     *
     * @example
     * Lang.get('app.base.title'); // Frontend Starter Kit
     * Lang.get('app.base.hello', { name: 'Alfred' }); // Hello, Alfred!
     * Lang.get('app.base.description'); // It will be "lang::app.base.description" if key did't exists
     *
     * @public
     */
    get(key, params = {}) {
        const compiledKey = get(this.translations(), key);

        if (!compiledKey) {
            return `lang::${key}`;
        }

        const {
            hasViewComponentParams,
            transformedParams
        } = this._transformViewComponentsToStrings(params);

        const string = compiledKey(transformedParams);

        if (!hasViewComponentParams) {
            return string;
        }

        return this._transformToArray(string, params);
    }

    /**
     * Transform string to array to inject React-like Components.
     *
     * @param {String} string - Translated string.
     * @param {Object} params - Parameters.
     *
     * @returns {Array}
     *
     * @private
     */
    _transformToArray(string, params) {
        return string
            .split(new RegExp(`\\$(${this._VIEW_COMPONENT_ID}:.*?)\\$`, 'g'))
            .map((part) => {
                if (part.indexOf(`${this._VIEW_COMPONENT_ID}:`) !== 0) {
                    return part;
                }

                const paramName = part.substr(`${this._VIEW_COMPONENT_ID}:`.length);

                return params[paramName];
            });
    }

    /**
     * Transform React-like Component to strings to insert JSX Markup into string.
     *
     * @param params - Parameters.
     *
     * @returns {{hasViewComponentParams: Boolean, transformedParams: Object}}
     *
     * @private
     */
    _transformViewComponentsToStrings(params) {
        let hasViewComponentParams = false;
        const transformedParams = {};

        Object.keys(params).forEach((paramName) => {
            if (React.isValidElement(params[paramName])) {
                hasViewComponentParams = true;
                transformedParams[paramName] = `$${this._VIEW_COMPONENT_ID}:${paramName}$`;
            } else {
                transformedParams[paramName] = params[paramName];
            }
        });

        return {
            hasViewComponentParams,
            transformedParams
        };
    }

    /**
     * Register translations.
     *
     * @param {Object} translations - Translations object.
     */
    register(translations) {
        this._translations = translations;
    }
}

