import { observable, action, computed } from 'mobx';

import Store from 'framework/Store';
import Config from 'framework/Config';
import Router from 'framework/Router';

import { createHistory } from 'app/utils/browserHistory';
import { parseUrl, isAppUrl } from 'framework/utils/url';

export default class RouterStore extends Store {
    _router = new Router();
    _history = createHistory();

    /**
     * Location object.
     *
     * @type {{url: String, scheme: ?String, host: ?String, path: ?String, query: ?String, fragment: ?String}}
     */
    @observable location = {};

    /**
     * Set location.
     *
     * @param {String} url
     * @param {Boolean} [replace=false] - need to store previous location state?
     */
    @action
    setLocation(url, replace = false) {
        this.location = parseUrl(url);

        if (replace) {
            this._history.replace(url);
        } else {
            this._history.push(url);
        }
    }

    /**
     * Register application route.
     *
     * @param {String} route
     * @param {Function} component - component that show
     * @param {?String} name - route name
     */
    @action
    register(route, component, name = null) {
        this._router.route(route, ['GET', 'HEAD', 'POST'], component, name);
    }

    /**
     * Get resolved route.
     *
     * @return {Object}
     */
    @computed
    get route() {
        return this._router.resolve(this.location.path, 'GET');
    }

    /**
     * Is registered application route.
     *
     * @param {String} location
     *
     * @return {Boolean}
     */
    isRegisteredRoute(location) {
        if (isAppUrl(location)) {
            location = location.substring(Config.get('app.baseUrl').length);
        }

        return Boolean(this._router.resolve(location, 'GET').handler);
    }
}
