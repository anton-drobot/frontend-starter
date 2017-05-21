import NE from 'node-exceptions';

export class RuntimeException extends NE.RuntimeException {
    /**
     * Default error code to be used for raising exceptions.
     *
     * @return {Number}
     */
    static get defaultErrorCode() {
        return 500;
    }

    /**
     * This exception is thrown when a locale not registered with any key.
     *
     * @param {String} locale
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static missingLocale(locale, code = this.defaultErrorCode) {
        return new this(
            `The locale ${locale} has not been found`,
            code,
            'E_MISSING_LOCALE'
        );
    }

    /**
     * This exception is thrown when a route action is referenced inside a view
     * but not registered within the routes file.
     *
     * @param {String} action
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static missingRouteHandler(action, code = this.defaultErrorCode) {
        return new this(
            `The handler ${action} has not been found`,
            code,
            'E_MISSING_ROUTE_HANDLER'
        );
    }

    /**
     * This exception is thrown when a route is referenced inside a view but not registered within the routes file.
     *
     * @param {String} route
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static missingRoute(route, code = this.defaultErrorCode) {
        return new this(
            `The route ${route} has not been found`,
            code,
            'E_MISSING_ROUTE'
        );
    }

    /**
     * This exceptions is raised when MAC is invalid when trying to encrypt data.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionMac(code = this.defaultErrorCode) {
        return new this(
            'The MAC is invalid',
            code,
            'E_INVALID_ENCRYPTION_MAC'
        );
    }

    /**
     * This exception is raised when encryption payload is not valid.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionPayload(code = this.defaultErrorCode) {
        return new this(
            'The payload is invalid',
            code,
            'E_INVALID_ENCRYPTION_PAYLOAD'
        );
    }

    /**
     * This exception is raised when expected value is not a valid json object.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static malformedJSON(code = this.defaultErrorCode) {
        return new this(
            'The payload is not a json object',
            code,
            'E_MALFORMED_JSON'
        );
    }

    /**
     * This exception is raised when an operation is attempted on a file that has been deleted.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static fileDeleted(code = this.defaultErrorCode) {
        return new this(
            'The file has already been deleted',
            code,
            'E_FILE_DELETED'
        );
    }

    /**
     * This exception is raised when encryption class is not able to decrypt a given piece of data.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static decryptFailed(code = this.defaultErrorCode) {
        return new this(
            'Could not decrypt the data',
            code,
            'E_ENCRYPTION_DECRYPT_FAILED'
        );
    }

    /**
     * This exception is raised when the encryption cipher is not supported
     * or app key length is not in-sync with given cipher.
     *
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static invalidEncryptionCipher(code = this.defaultErrorCode) {
        return new this(
            'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths',
            code,
            'E_INVALID_ENCRYPTION_CIPHER'
        );
    }

    /**
     * This exception is raised when app key is missing inside config/app.js file.
     *
     * @param {String} message
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static missingAppKey(message, code = this.defaultErrorCode) {
        return new this(
            message,
            code,
            'E_MISSING_APPKEY'
        );
    }

    /**
     * This exception is raised when an unknown session driver is used.
     *
     * @param {String} driver
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static invalidSessionDriver(driver, code = this.defaultErrorCode) {
        return new this(
            `Unable to locate ${driver} session driver`,
            code,
            'E_INVALID_SESSION_DRIVER'
        );
    }

    /**
     * This exception is raised when a named middleware is used but not registered.
     *
     * @param {String} name
     * @param {Number} [code=500]
     *
     * @return {RuntimeException}
     */
    static missingNamedMiddleware(name, code = this.defaultErrorCode) {
        return new this(
            `${name} is not registered as a named middleware`,
            code,
            'E_MISSING_NAMED_MIDDLEWARE'
        );
    }
}

export class InvalidArgumentException extends NE.InvalidArgumentException {
    /**
     * Default error code to be used for raising exceptions.
     *
     * @return {Number}
     */
    static get defaultErrorCode() {
        return 500;
    }

    /**
     * This exception is raised when a method parameter is missing but expected to exist.
     *
     * @param {String} message
     * @param {Number} [code=500]
     *
     * @return {InvalidArgumentException}
     */
    static missingParameter(message, code = this.defaultErrorCode) {
        return new this(
            message,
            code,
            'E_MISSING_PARAMETER'
        );
    }

    /**
     * This exception is raised when a method parameter value is invalid.
     *
     * @param {String} message
     * @param {Number} [code=500]
     *
     * @return {InvalidArgumentException}
     */
    static invalidParameter(message, code = this.defaultErrorCode) {
        return new this(
            message,
            code,
            'E_INVALID_PARAMETER'
        );
    }
}

export const HttpException = NE.HttpException;
