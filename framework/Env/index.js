import dotenv from 'dotenv';

/**
 * Manage environment variables by reading .env file inside the project root.
 */
class Env {
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
    isTest = process.env.NODE_ENV === 'testing';

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
    isServerSide = typeof global === 'object' && global.global === global;

    /**
     * Is client side.
     *
     * @type {Boolean}
     */
    isClientSide = !this.isServerSide;

    constructor() {
        const options = {
            path: this.envPath,
            encoding: process.env.ENV_ENCODING || 'utf8'
        };

        dotenv.load(options);
    }

    /**
     * Returns envPath by checking the environment variables.
     *
     * @method envPath
     *
     * @return {String}
     *
     * @public
     */
    get envPath() {
        if (!process.env.ENV_PATH || process.env.ENV_PATH.length === 0) {
            return '.env';
        }

        return process.env.ENV_PATH;
    }

    /**
     * Get value of an existing key from env file.
     *
     * @param {String} key - key to read value for
     * @param {*} [defaultValue] - default value to be used when actual value is undefined or null.
     *
     * @return {*}
     *
     * @example
     * Env.get('APP_PORT');
     * Env.get('CACHE_VIEWS', false);
     *
     * @public
     */
    get(key, defaultValue = null) {
        let returnValue = process.env[key] || defaultValue;

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
     * @param {String} key - key to set value for
     * @param {*} value - value to save next to defined key
     *
     * @example
     * Env.set('CACHE_VIEWS', true);
     *
     * @public
     */
    set(key, value) {
        process.env[key] = value;
    }
}

export default new Env();
