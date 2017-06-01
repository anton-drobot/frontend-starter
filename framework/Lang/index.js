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

        return compiledKey ? compiledKey(params) : `lang::${key}`;
    }

    /**
     * Register translations.
     *
     * @todo merge translations if keys exists.
     *
     * @param {String} name - module name
     * @param {String} locale - locale
     * @param {Object} translations - translations object
     */
    register(name, locale, translations) {
        if (!this._translations[locale]) {
            this._translations[locale] = {};
        }

        this._translations[locale][name] = translations;
        /*Object.keys(translations).forEach((locale) => {
            if (!this._translations[locale]) {
                this._translations[locale] = {};
            }

            this._translations[locale][name] = translations[locale];
        });*/
    }
}

export default new Lang();
