import { observable, action, computed } from 'mobx';

import Store from 'framework/Store';
import Config from 'framework/Config';
import Router from 'framework/Router';

import { createHistory } from 'app/utils/browserHistory';
import { parseUrl, isAppUrl } from 'framework/utils/url';

export default class RouterStore extends Store {
    _routes = {};
    _router = new Router();
    _history = createHistory();

    /**
     * Location object.
     *
     * @type {{url: String, scheme: ?String, host: ?String, path: ?String, query: ?String, fragment: ?String}}
     */
    @observable location = {};

    @action
    push(url) {
        this._history.push(url);
    }

    @action
    replace(url) {
        this._history.replace(url);
    }

    /**
     * Set location.
     *
     * @param {String} url
     */
    @action
    async setLocation(url) {
        this.location = parseUrl(url);

        if (this.route.handler && this.route.handler.onRequest) {
            await this.route.handler.onRequest(Store.getStores());
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
    registerRoute(route, component, name = null) {
        this._router.route(route, ['GET', 'HEAD', 'POST'], component, name);
    }

    @action
    registerRoutes(routes = {}) {
        this._routes = routes;

        Object.keys(routes).forEach((routeName) => {
            const { route, component } = routes[routeName];
            this.registerRoute(route, component, routeName);
        });
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

    is(route) {
        return this.route.route === route.route;
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

    getRoutes() {
        return this._routes;
    }
}
