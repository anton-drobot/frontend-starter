import { observable, action } from 'mobx';
import pathToRegexp from 'path-to-regexp';
import { serializable } from 'serializr';

import { ENV_PROVIDER, STORE_PROVIDER, URL_PROVIDER } from 'framework/Providers/types';
import { createHistory } from 'framework/libs/browserHistory';

const URL = global.Container.make(URL_PROVIDER);
const Env = global.Container.make(ENV_PROVIDER);
const Store = global.Container.make(STORE_PROVIDER);

export default class RouterStore extends Store {
    _history = createHistory(Env);
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
        this.location = new URL(url);
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
        const location = new URL(url);

        return Object.values(this._routes).findIndex(({ pattern }) => pattern.test(location.pathname)) !== -1;
    }
}
