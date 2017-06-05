import 'isomorphic-fetch';

import Env from 'framework/Env';
import { HttpException } from 'framework/Exceptions';
import { appUrl, buildQuery } from 'framework/utils/url';

export default class Store {
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

    async request(path, method = 'GET', { query = null, data = null } = {}) {
        if (path.indexOf('/') === 0) {
            path = path.substr(1);
        }

        if (query) {
            path = `${path}?${buildQuery(query)}`;
        }

        const url = appUrl(`api/${path}`);

        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new HttpException(response.statusText);
        }

        return await response.json();
    }

    async get(path, { query = null } = {}) {
        return await this.request(path, 'GET', { query });
    }

    async post(path, { query = null, data = {} } = {}) {
        return await this.request(path, 'POST', { query, data });
    }
}
