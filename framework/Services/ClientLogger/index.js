export default class ClientLogger {
    constructor(prefix, level) {
        this._prefix = prefix;
        this._level = level;
    }

    info(...args) {
        console.log(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    error(...args) {
        console.error(...args);
    }

    debug(...args) {
        console.log(...args);
    }

    verbose(...args) {
        console.log(...args);
    }

    silly(...args) {
        console.log(...args);
    }

}
