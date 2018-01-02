// @flow

export interface LogicalExceptionInterface {
    message: string,
    name: string,
    status: number,
    code: string,
    data: Object,
    stack?: string,
    constructor(message: string, status?: number, code?: string, data?: Object): void,
    toJSON(): Object
}
