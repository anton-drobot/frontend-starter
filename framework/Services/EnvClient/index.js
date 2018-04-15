/**
 * Manage environment variables.
 */
export default class EnvServer {
    /**
     * Env store.
     *
     * @type {Object}
     *
     * @private
     */
    _env = {};

    /**
     * Is development environment.
     *
     * @type {Boolean}
     */
    isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Is development environment.
     *
     * @type {Boolean}
     */
    isTesting = process.env.NODE_ENV === 'testing';

    /**
     * Is production environment.
     *
     * @type {Boolean}
     */
    isProduction = process.env.NODE_ENV === 'production';

    /**
     * Is server side.
     *
     * @type {Boolean}
     */
    isServerSide = false;

    /**
     * Is client side.
     *
     * @type {Boolean}
     */
    isClientSide = true;

    /**
     * Get value of an existing key from env file.
     *
     * @param {String} key - Key to read value for.
     * @param {*} [defaultValue] - Default value to be used when actual value is undefined or null.
     *
     * @return {*}
     *
     * @example
     * Env.get('APP_PORT');
     * Env.get('CACHE_VIEWS', false);
     *
     * @public
     */
    get(key, defaultValue) {
        let returnValue = this._env[key] || defaultValue;

        if (returnValue === 'true' || returnValue === '1') {
            return true;
        }

        if (returnValue === 'false' || returnValue === '0') {
            return false;
        }

        return returnValue;
    }

    /**
     * Set or update value for a given key.
     *
     * @param {String} key - Key to set value for.
     * @param {*} value - Value to save next to defined key.
     *
     * @example
     * Env.set('CACHE_VIEWS', true);
     *
     * @public
     */
    set(key, value) {
        this._env[key] = value;
    }
}
