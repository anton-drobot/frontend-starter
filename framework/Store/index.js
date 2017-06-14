import 'isomorphic-fetch';

import Env from 'framework/Env';
import JsonApi from 'framework/JsonApi';
import { appUrl } from 'framework/utils/url';

export default class Store extends JsonApi {
    apiUrl = appUrl('api');

    static _stores = {};

    static getStores() {
        return Store._stores;
    }

    static loadInitialState() {
        if (Env.isClientSide) {
            const initialState = window.__INITIAL_STATE__;

            if (typeof initialState === 'object') {
                Object.getOwnPropertyNames(initialState).forEach((propName) => {
                    Object.assign(Store._stores[propName], initialState[propName]);
                });
            }
        }
    }

    /**
     * Register store.
     *
     * @param {String} name
     * @param {Function} StoreClass
     *
     * @public
     */
    static register(name, StoreClass) {
        Store._stores[name] = new StoreClass();
    }
}
