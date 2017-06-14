import get from 'lodash/get';
import set from 'lodash/set';

/**
 * Manage configuration for an application by adding config objects.
 */
class Config {
    /**
     * Config store.
     *
     * @type {Object}
     *
     * @private
     */
    _config = {};

    /**
     *
     * @param {String} name - configuration name
     * @param {Object} config - configuration object
     */
    registerConfig(name, config = {}) {
        this._config[name] = config;
    }

    /**
     * Get value for a given key from config store.
     *
     * @param {String} key - configuration key to return value for
     * @param {*} [defaultValue] - default value to return when actual value is null or undefined
     *
     * @return {*}
     *
     * @example
     * Config.get('database.connection');
     * Config.get('database.mysql.host', 'localhost');
     *
     * @public
     */
    get(key, defaultValue = null) {
        return get(this._config, key, defaultValue);
    }

    /**
     * Set or update value for a given key inside config store.
     *
     * @param {String} key - key to set value for
     * @param {*} value - value to be saved next to defined key
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

export default new Config();
