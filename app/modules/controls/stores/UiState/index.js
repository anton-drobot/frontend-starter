import { observable, action } from 'mobx';
import { serializable, map } from 'serializr';

import { STORE_PROVIDER } from 'framework/Providers/types';

const Store = global.Container.make(STORE_PROVIDER);

export default class UiStateStore extends Store {
    /**
     * Used to generate unique IDs.
     *
     * @type {Number}
     */
    idCounter = 0;

    /**
     * Form values.
     *
     * @type {Map}
     */
    @serializable(map()) @observable values = new Map();

    /**
     * Get form value.
     *
     * @param {String} id - Unique identifier of the form element (input, checkbox, etc).
     *
     * @return {*}
     */
    getValue(id) {
        return this.values.get(id);
        //return computed(() => this.values.get(id)).get();
    }

    //getValue = computed((id) => this.values.get()[id]);

    /**
     * Set from value.
     *
     * @param {String} id - Unique identifier of the form element (input, checkbox, etc).
     * @param {*} value
     */
    @action
    setValue(id, value) {
        this.values.set(id, value);
    }

    /**
     * Generates a unique ID. If "prefix" is given, the ID is appended to it.
     *
     * @param {String} [prefix=''] - The value to prefix the ID with.
     *
     * @return {String} - Returns the unique ID.
     */
    uniqueId(prefix = '') {
        const id = ++this.idCounter;
        return prefix + id;
    }
}
