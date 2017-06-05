import 'isomorphic-fetch';

import Env from 'framework/Env';
import { HttpException } from 'framework/Exceptions';
import { buildQuery } from 'framework/utils/url';

export default class Api {
    static _apiMethods = [];

    method = 'GET';

    static getMethods() {
        return Api._apiMethods;
    }

    constructor() {
        Api._apiMethods.push(this);
    }

    async request(path, method = 'GET', { query = null, data = null } = {}) {
        if (path.indexOf('/') === 0) {
            path = path.substr(1);
        }

        if (query) {
            path = `${path}?${buildQuery(query)}`;
        }

        let backendUrl = Env.get('BACKEND_URL');

        if (backendUrl.lastIndexOf('/') === (backendUrl.length - 1)) {
            backendUrl = backendUrl.slice(0, -1);
        }

        const url = `${backendUrl}/${path}`;

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
