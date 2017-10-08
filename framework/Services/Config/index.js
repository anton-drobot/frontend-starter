import get from 'lodash/get';
import set from 'lodash/set';

/**
 * Manage configuration for an application by adding config objects.
 */
export default class Config {
    /**
     * Config store.
     *
     * @type {Object}
     *
     * @private
     */
    _config = {};

    /**
     * Register configuration object.
     *
     * @param {String} name - Configuration name.
     * @param {Object} config - Configuration object.
     */
    register(name, config) {
        this._config[name] = config;
    }

    /**
     * Get configuration object.
     *
     * @return {Object}
     *
     * @public
     */
    getAll() {
        return this._config;
    }

    /**
     * Get value for a given key from config store.
     *
     * @param {String} key - Configuration key to return value for.
     * @param {*} [defaultValue] - Default value to return when actual value is undefined.
     *
     * @return {*}
     *
     * @example
     * Config.get('database.connection');
     * Config.get('database.mysql.host', 'localhost');
     *
     * @public
     */
    get(key, defaultValue) {
        return get(this._config, key, defaultValue);
    }

    /**
     * Set or update value for a given key inside config store.
     *
     * @param {String} key - Key to set value for.
     * @param {*} value - Value to be saved next to defined key.
     *
     * @example
     * Config.set('database.connection', 'mysql');
     * Config.set('database.mysql.host', 'localhost');
     *
     * @public
     */
    set(key, value) {
        set(this._config, key, value);
    }
}
