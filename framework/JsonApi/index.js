import { HttpException } from 'framework/Exceptions';
import { buildQuery } from 'framework/utils/url';

export default class JsonApi {
    apiUrl = '';

    async apiRequest(path, method = 'GET', { query = null, data = null } = {}) {
        if (path.indexOf('/') === 0) {
            path = path.substr(1);
        }

        if (query) {
            path = `${path}?${buildQuery(query)}`;
        }

        if (this.apiUrl.lastIndexOf('/') === (this.apiUrl.length - 1)) {
            this.apiUrl = this.apiUrl.slice(0, -1);
        }

        const url = `${this.apiUrl}/${path}`;

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

    async apiGet(path, { query = null } = {}) {
        return await this.apiRequest(path, 'GET', { query });
    }

    async apiPost(path, { query = null, data = {} } = {}) {
        return await this.apiRequest(path, 'POST', { query, data });
    }
}
