// @flow

import type { LogicalExceptionInterface } from '../LogicalExceptionInterface';

/**
 * LogicalException is a neutral class extend the Error object.
 *
 * @class LogicalException
 */
export default class LogicalException extends Error implements LogicalExceptionInterface {
    message: string;
    name: string;
    status: number;
    code: string;
    data: Object;
    stack: string;

    constructor(message?: string, status?: number = 500, code?: string = 'E_INTERNAL_ERROR', data?: Object = {}) {
        // because default value for argument didn't work if argument value is empty string.
        message = message || 'Internal error';

        super(message);

        // extending Error is weird and does not propagate `message`
        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message,
            writable: true
        });

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name,
            writable: true
        });

        Object.defineProperty(this, 'status', {
            configurable: true,
            enumerable: false,
            value: status,
            writable: true
        });

        Object.defineProperty(this, 'code', {
            configurable: true,
            enumerable: false,
            value: code,
            writable: true
        });

        Object.defineProperty(this, 'data', {
            configurable: true,
            enumerable: false,
            value: data,
            writable: true
        });

        if (Error.hasOwnProperty('captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor);

            return;
        }

        Object.defineProperty(this, 'stack', {
            configurable: true,
            enumerable: false,
            value: (new Error(message)).stack,
            writable: true
        });
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
            code: this.code,
            data: this.data
        };
    }
}
