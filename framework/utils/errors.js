/**
 * Normalize error object by setting required parameters if they does not exists.
 *
 * @param {LogicalException|Error} error
 *
 * @return {LogicalException|Error}
 */
export function normalizeError(error) {
    error.message = error.message || 'Internal error';
    error.status = error.status || 500;
    error.code = error.code || 'E_INTERNAL_ERROR';
    error.data = error.data || {};

    if (!error.toJSON) {
        error.toJSON = function () {
            return {
                message: this.message,
                status: this.status,
                code: this.code,
                data: this.data
            };
        };
    }

    return error;
}
