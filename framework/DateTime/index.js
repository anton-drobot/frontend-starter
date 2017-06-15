import Env from '../Env';

export default class DateTime {
    instance;

    constructor(...args) {
        if (args.length > 0) {
            this.instance = new Date(...args);

            return this;
        }

        let now = Date.now();

        /**
         * Time correction if the user has an incorrect time. Maybe a deviation of a few seconds.
         */
        if (Env.isClientSide && window.timeCorrection) {
            now += window.timeCorrection;
        }

        this.instance = new Date(now);

        return this;
    }

    /**
     * @todo: реализовать функцию DateTime#format
     * https://date-fns.org/
     */
    format() {}

    toJSON() {
        return this.instance.toISOString();
    }

    toString() {
        return this.instance.toISOString();
    }

    valueOf() {
        return this.instance.getTime();
    }
}
