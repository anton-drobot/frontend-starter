import pathToRegexp from 'path-to-regexp';

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
     * @param {?String} [name=null]
     *
     * @return {Object}
     *
     * @private
     */
    _makeRoute(route, method, handler, name = null) {
        method = Array.isArray(method) ? method : [method]; // route can register for multiple methods
        const { pattern, tokens } = this._makeRoutePattern(route);

        return {
            name,
            route,
            pattern,
            tokens,
            method,
            handler
        };
    }

    /**
     * Make regex pattern for a given route.
     *
     * @param {String} route
     *
     * @return {{pattern: RegExp, tokens: Array}}
     *
     * @private
     */
    _makeRoutePattern(route) {
        const tokens = [];
        const pattern = pathToRegexp(route, tokens);

        return {
            pattern,
            tokens
        };
    }

    /**
     * Resolve route from routes store based upon current URL.
     *
     * @param {String} path - Path to url.
     * @param {String} method - HTTP method.
     *
     * @return {Object}
     *
     * @private
     */
    _returnMatchingRouteToUrl(path, method) {
        const route = this._routes.find((route) => (route.pattern.test(path) && route.method.includes(method))) || {};

        if (route.handler) {
            route.params = this._getRouteParams(route, path);
        }

        return route;
    }

    _getRouteParams(route, path) {
        const paramsValues = route.pattern.exec(path);
        const params = {};

        route.tokens.forEach((token, index) => {
            params[token.name] = paramsValues[index + 1];
        });

        return params;
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
     * @param {String} route - Route expression.
     * @param {String|Array} method - HTTP method.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.route('/welcome', 'GET', async () => {
     *
     * });
     *
     * @public
     */
    route(route, method, handler, name = null) {
        let constructedRoute = this._makeRoute(route, method, handler, name);
        this._routes.push(constructedRoute);

        return this;
    }

    /**
     * Register route with GET method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.get('/user', async () => {
     *
     * });
     *
     * @public
     */
    get(route, handler, name = null) {
        this.route(route, ['GET', 'HEAD'], handler, name);

        return this;
    }

    /**
     * Register route with POST method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.post('/user', async () => {
     *
     * });
     *
     * @public
     */
    post(route, handler, name = null) {
        this.route(route, 'POST', handler, name);

        return this;
    }

    /**
     * Register route with PUT method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.put('/user/:id', async () => {
     *
     * });
     *
     * @public
     */
    put(route, handler, name = null) {
        this.route(route, 'PUT', handler, name);

        return this;
    }

    /**
     * Register route with PATCH method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.patch('/user/:id', async () => {
     *
     * });
     *
     * @public
     */
    patch(route, handler, name = null) {
        this.route(route, 'PATCH', handler, name);

        return this;
    }

    /**
     * Register route with DELETE method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.delete('/user/:id', async () => {
     *
     * });
     *
     * @public
     */
    delete(route, handler, name = null) {
        this.route(route, 'DELETE', handler, name);

        return this;
    }

    /**
     * Register route with OPTIONS method.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     * @param {?String} [name=null] - Route name.
     *
     * @return {Router}
     *
     * @example
     * Route.options('/user/:id', async () => {
     *
     * });
     *
     * @public
     */
    options(route, handler, name = null) {
        this.route(route, 'OPTIONS', handler, name);

        return this;
    }

    /**
     * Registers a route with multiple HTTP methods.
     *
     * @param {Array} methods - An array of methods.
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     *
     * @return {Router}
     *
     * @example
     * Route.match(['GET', 'POST'], '/user', async () => {
     *
     * });
     *
     * @public
     */
    match(methods, route, handler) {
        this.route(route, methods, handler);

        return this;
    }

    /**
     * Registers route for all HTTP methods.
     *
     * @param {String} route - Route expression.
     * @param {Function} handler - Handler to respond to a given request.
     *
     * @return {Router}
     *
     * @example
     * Route.any('/user', async () => {
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
     * @param {String} path - Path to url.
     * @param {String} method - HTTP method.
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
