import LogicalException from '../LogicalException';

export default class RuntimeException extends LogicalException {
    /**
     * Default error status to be used for raising exceptions.
     *
     * @return {Number}
     */
    static get defaultErrorStatus() {
        return 500;
    }

    /**
     * This exception is thrown when a locale not registered with any key.
     *
     * @param {String} [locale]
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static missingLocale(locale, status = this.defaultErrorStatus) {
        return new this(
            locale ?
                `The locale "${locale}" has not been found.` :
                'The locale is not set. Use the Lang#setLocale to set the locale.',
            status,
            'E_MISSING_LOCALE'
        );
    }

    /**
     * This exception is thrown when a route action is referenced inside a view
     * but not registered within the routes file.
     *
     * @param {String} action
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static missingRouteHandler(action, status = this.defaultErrorStatus) {
        return new this(
            `The handler "${action}" has not been found.`,
            status,
            'E_MISSING_ROUTE_HANDLER'
        );
    }

    /**
     * This exception is thrown when a route is referenced inside a view but not registered within the routes file.
     *
     * @param {String} route
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static missingRoute(route, status = this.defaultErrorStatus) {
        return new this(
            `The route "${route}" has not been found.`,
            status,
            'E_MISSING_ROUTE'
        );
    }

    /**
     * This exceptions is raised when MAC is invalid when trying to encrypt data.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionMac(status = this.defaultErrorStatus) {
        return new this(
            'The MAC is invalid.',
            status,
            'E_INVALID_ENCRYPTION_MAC'
        );
    }

    /**
     * This exception is raised when encryption payload is not valid.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionPayload(status = this.defaultErrorStatus) {
        return new this(
            'The payload is invalid.',
            status,
            'E_INVALID_ENCRYPTION_PAYLOAD'
        );
    }

    /**
     * This exception is raised when expected value is not a valid json object.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static malformedJSON(status = this.defaultErrorStatus) {
        return new this(
            'The payload is not a json object.',
            status,
            'E_MALFORMED_JSON'
        );
    }

    /**
     * This exception is raised when an operation is attempted on a file that has been deleted.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static fileDeleted(status = this.defaultErrorStatus) {
        return new this(
            'The file has already been deleted.',
            status,
            'E_FILE_DELETED'
        );
    }

    /**
     * This exception is raised when encryption class is not able to decrypt a given piece of data.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static decryptFailed(status = this.defaultErrorStatus) {
        return new this(
            'Could not decrypt the data.',
            status,
            'E_ENCRYPTION_DECRYPT_FAILED'
        );
    }

    /**
     * This exception is raised when the encryption cipher is not supported
     * or app key length is not in-sync with given cipher.
     *
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionCipher(status = this.defaultErrorStatus) {
        return new this(
            'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.',
            status,
            'E_INVALID_ENCRYPTION_CIPHER'
        );
    }

    /**
     * This exception is raised when app key is missing inside config/app.js file.
     *
     * @param {String} message
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static missingAppKey(message, status = this.defaultErrorStatus) {
        return new this(
            message,
            status,
            'E_MISSING_APPKEY'
        );
    }

    /**
     * This exception is raised when an unknown session driver is used.
     *
     * @param {String} driver
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static invalidSessionDriver(driver, status = this.defaultErrorStatus) {
        return new this(
            `Unable to locate "${driver}" session driver.`,
            status,
            'E_INVALID_SESSION_DRIVER'
        );
    }

    /**
     * This exception is raised when a named middleware is used but not registered.
     *
     * @param {String} name
     * @param {Number} [status=500]
     *
     * @return {RuntimeException}
     */
    static missingNamedMiddleware(name, status = this.defaultErrorStatus) {
        return new this(
            `"${name}" is not registered as a named middleware.`,
            status,
            'E_MISSING_NAMED_MIDDLEWARE'
        );
    }
}
