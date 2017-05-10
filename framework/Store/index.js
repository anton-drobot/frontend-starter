import Env from 'framework/Env';
import { lowerFirst } from 'framework/utils/string';

class Store {
    _store = {};

    constructor(Env) {
        this._env = Env;
    }

    loadInitialState() {
        if (this._env.isClientSide) {
            const preloadedState = window.__INITIAL_STATE__;

            if (typeof preloadedState === 'object') {
                Object.getOwnPropertyNames(preloadedState).forEach((propName) => {
                    Object.assign(this._store[propName], preloadedState[propName]);
                });
            }
        }
    }

    getStore() {
        return this._store;
    }

    /**
     * Register store.
     *
     * @param {Function} StoreClass
     *
     * @public
     */
    register(StoreClass) {
        const name = lowerFirst(StoreClass.name.substring(0, StoreClass.name.indexOf('Store')));
        this._store[name] = new StoreClass();
    }
}

export default new Store(Env);
