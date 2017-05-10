import pathToRegexp from 'path-to-regexp';
import { normalizePath } from '../utils/url';

export default class Router {
    /**
     * Holding reference to registered routes.
     *
     * @type {Array}
     *
     * @private
     */
    _routes = [];

    /**
     * Construct a new route using path-to-regexp.
     *
     * @param {String} route
     * @param {String} method
     * @param {Function} handler
     *
     * @return {Object}
     *
     * @private
     */
    _makeRoute(route, method, handler) {
        route = normalizePath(route);
        method = Array.isArray(method) ? method : [method]; // route can register for multiple methods
        const pattern = this._makeRoutePattern(route);

        return {
            route,
            pattern,
            method,
            handler
        };
    }

    /**
     * Make regex pattern for a given route.
     *
     * @param {String} route
     *
     * @return {RegExp}
     *
     * @private
     */
    _makeRoutePattern(route) {
        return pathToRegexp(route, []);
    }

    /**
     * Resolve route from routes store based upon current URL.
     *
     * @param {String} path - path to url
     * @param {String} method - HTTP method
     *
     * @return {Object}
     *
     * @private
     */
    _returnMatchingRouteToUrl(path, method) {
        return this._routes.find((route) => (route.pattern.test(path) && route.method.includes(method))) || {};
    }

    /**
     * Return all registered routes.
     *
     * @return {Array}
     *
     * @public
     */
    routes() {
        return this._routes;
    }

    /**
     * A low level method to register route with path, method and handler.
     *
     * @param {String} route - route expression
     * @param {String|Array} method - HTTP method
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.route('/welcome', 'GET', function * () {
     *
     * });
     *
     * @public
     */
    route(route, method, handler) {
        let constructedRoute = this._makeRoute(route, method, handler);
        this._routes.push(constructedRoute);

        return this;
    }

    /**
     * Register route with GET method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.get('/user', function * () {
     *
     * });
     *
     * @public
     */
    get(route, handler) {
        this.route(route, ['GET', 'HEAD'], handler);

        return this;
    }

    /**
     * Register route with POST method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.post('/user', function * () {
     *
     * });
     *
     * @public
     */
    post(route, handler) {
        this.route(route, 'POST', handler);

        return this;
    }

    /**
     * Register route with PUT method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.put('/user/:id', function * () {
     *
     * });
     *
     * @public
     */
    put(route, handler) {
        this.route(route, 'PUT', handler);

        return this;
    }

    /**
     * Register route with PATCH method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.patch('/user/:id', function * () {
     *
     * });
     *
     * @public
     */
    patch(route, handler) {
        this.route(route, 'PATCH', handler);

        return this;
    }

    /**
     * Register route with DELETE method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.delete('/user/:id', function * () {
     *
     * });
     *
     * @public
     */
    delete(route, handler) {
        this.route(route, 'DELETE', handler);

        return this;
    }

    /**
     * Register route with OPTIONS method.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.put('/user/:id', function * () {
     *
     * });
     *
     * @public
     */
    options(route, handler) {
        this.route(route, 'OPTIONS', handler);

        return this;
    }

    /**
     * Registers a route with multiple HTTP methods.
     *
     * @param {Array} methods - an array of methods
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.match(['GET', 'POST'], '/user', function * () {
     *
     * });
     *
     * @public
     */
    match(methods, route, handler) {
        methods = methods.map((method) => (method.toUpperCase()));
        this.route(route, methods, handler);

        return this;
    }

    /**
     * Registers route for all HTTP methods.
     *
     * @param {String} route - route expression
     * @param {Function} handler - handler to respond to a given request
     *
     * @return {Router}
     *
     * @example
     * Route.any('/user', function * () {
     *
     * });
     *
     * @public
     */
    any(route, handler) {
        const methods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
        this.route(route, methods, handler);

        return this;
    }

    /**
     * Resolves route for a given url and HTTP method.
     *
     * @param {String} path - path to url
     * @param {String} method - HTTP method
     *
     * @return {Object}
     *
     * @example
     * Route.resolve('/user/1', 'GET');
     *
     * @public
     */
    resolve(path, method) {
        return this._returnMatchingRouteToUrl(path, method);
    }
};
