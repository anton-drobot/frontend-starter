import { transaction } from 'mobx';
import {
    createSimpleSchema,
    serialize,
    update,
    object
} from 'serializr';

export default class StoreCollection {
    /**
     * Collection of Store classes.
     *
     * @type {Map}
     *
     * @private
     */
    _collection = new Map();

    /**
     * Store.
     *
     * @type {Object}
     *
     * @private
     */
    _store;

    /**
     * Schema for serialize and deserialize store.
     *
     * @type {Object}
     *
     * @private
     */
    _schema;

    /**
     * @param {EnvServer} Env - Dependency.
     */
    constructor(Env) {
        this._env = Env;
    }

    /**
     * Get store.
     *
     * @return {Object}
     */
    store() {
        return this._store;
    }

    /**
     * Register store class.
     *
     * @param {String} identifier - Store name.
     * @param {Store} store - Store class.
     */
    register(identifier, store) {
        this._collection.set(identifier, store);
    }

    createStore() {
        this._store = {};
        const mapping = {};

        this._collection.forEach((Store, identifier) => {
            this._store[identifier] = new Store();
            mapping[identifier] = object(Object.getPrototypeOf(this._store[identifier]));
        });

        this._schema = createSimpleSchema(mapping);
    }

    /**
     * Serialize store to Object.
     *
     * @return {Object}
     */
    serialize() {
        return serialize(this._schema, this._store);
    }

    /**
     * Deserialize store from Object.
     *
     * @param {Object} json
     */
    deserialize(json) {
        transaction(() => {
            update(this._schema, this._store, json);
        });
    }

    deserializeFromInitialState() {
        if (this._env.isClientSide) {
            const initialState = window.__INITIAL_STATE__;

            if (Object.prototype.toString.call(initialState) === '[object Object]') {
                this.deserialize(initialState);
            }
        }
    }
}
