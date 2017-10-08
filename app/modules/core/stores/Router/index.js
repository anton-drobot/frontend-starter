import { observable, action } from 'mobx';
import pathToRegexp from 'path-to-regexp';
import { serializable } from 'serializr';

import { STORE_PROVIDER } from 'framework/Providers/types';
import { createHistory } from 'framework/utils/browserHistory';
import { parse } from 'framework/utils/url';

const Store = global.Container.make(STORE_PROVIDER);

export default class RouterStore extends Store {
    _history = createHistory();
    _routes = {};

    @observable location;

    @serializable @observable httpStatus;

    @action
    go(url, { replace = false } = {}) {
        if (replace) {
            this.replace(url);
        } else {
            this.push(url);
        }

        this.setLocation(url);
    }

    @action
    push(url) {
        this._history.push(url);
    }

    @action
    replace(url) {
        this._history.replace(url);
    }

    @action
    setLocation(url) {
        this.location = parse(url);
    }

    @action
    setHttpStatus(httpStatus) {
        this.httpStatus = httpStatus;
    }

    match(route) {
        if (!this._routes[route]) {
            return false;
        }

        return this._routes[route].pattern.test(this.location.pathname);
    }

    setRoute(route) {
        const tokens = [];
        const pattern = pathToRegexp(route, tokens);
        this._routes[route] = { pattern, tokens };
    }

    isApplicationUrl(url) {
        const location = parse(url);

        return Object.values(this._routes).findIndex(({ pattern }) => pattern.test(location.pathname)) !== -1;
    }
}
