import LogicalException from '../LogicalException';

export default class InvalidArgumentException extends LogicalException {
    /**
     * Default error status to be used for raising exceptions.
     *
     * @return {Number}
     */
    static get defaultErrorStatus() {
        return 500;
    }

    /**
     * This exception is raised when a method parameter is missing but expected to exist.
     *
     * @param {String} message
     * @param {Number} [status=500]
     *
     * @return {InvalidArgumentException}
     */
    static missingParameter(message, status = this.defaultErrorStatus) {
        return new this(
            message,
            status,
            'E_MISSING_PARAMETER'
        );
    }

    /**
     * This exception is raised when a method parameter value is invalid.
     *
     * @param {String} message
     * @param {Number} [status=500]
     *
     * @return {InvalidArgumentException}
     */
    static invalidParameter(message, status = this.defaultErrorStatus) {
        return new this(
            message,
            status,
            'E_INVALID_PARAMETER'
        );
    }
}
