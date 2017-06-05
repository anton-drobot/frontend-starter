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
     * @return {String}
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

        // Need to insert React Markup into string
        const transpiledParams = {};
        let hasReactParams = false;

        Object.keys(params).forEach((paramName) => {
            if (React.isValidElement(params[paramName])) {
                transpiledParams[paramName] = `$ReactComponent:${paramName}$`;
                hasReactParams = true;
            } else {
                transpiledParams[paramName] = params[paramName];
            }
        });

        const string = compiledKey(transpiledParams);

        if (!hasReactParams) {
            return string;
        }

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
     * Register translations.
     *
     * @param {Object} translations - translations object
     */
    register(translations) {
        this._translations = translations;
    }
}

export default new Lang();
