// @flow

import LogicalException from '../Exceptions/LogicalException';

/**
 * Normalize error object by setting required parameters if they does not exists.
 *
 * @param {Error|LogicalException|Object} error
 *
 * @return {LogicalException}
 */
export function normalizeError(error: Error | LogicalException): LogicalException {
    if (!(error instanceof LogicalException)) {
        return new LogicalException(error.message);
    }

    return error;
}
