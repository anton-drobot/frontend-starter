import Koa from 'koa';
import koaStatic from 'koa-static';
import helmet from 'koa-helmet';
import uuid from 'uuid/v4';
//import bodyParser from 'koa-bodyparser';
import CatLog from 'cat-log';
import ms from 'ms';
import bytes from 'bytes';
import Env from '../Env';
import Config from '../Config';
import Helpers from '../Helpers';
import { HttpException } from '../Exceptions';

// Webpack
import webpack from 'webpack'
import webpackMiddleware from 'webpack-koa2-middleware'
import webpackConfig from 'webpack.config';

class Server {
    _appInstance;

    _log = new CatLog('framework/Server');

    /**
     * @param {Env} Env
     * @param {Config} Config
     * @param {Object} Helpers
     * @param {Router} router
     */
    constructor(Env, Config, Helpers, router) {
        this._env = Env;
        this._config = Config;
        this._helpers = Helpers;
        this._router = router;
    }

    /**
     * Initial server setup.
     *
     * @private
     */
    _registerApp() {
        this._appInstance = new Koa();

        /**
         * Security.
         */
        this._appInstance.use(this._generateNonce);
        this._appInstance.use(helmet(this._config.get('server.helmet')));

        /**
         * Request logger.
         */
        this._appInstance.use(this._requestLogger.bind(this));

        /**
         * Webpack.
         */
        if (this._env.isDevelopment) {
            const compile = webpack(webpackConfig);

            this._appInstance.use(webpackMiddleware(compile, {
                noInfo: true,
                lazy: true,
                publicPath: webpackConfig.output.publicPath,
                stats: 'errors-only',
            }));
        }

        /**
         * Serves static resource using static server.
         */
        if (this._config.get('server.static')) {
            this._appInstance.use(koaStatic(this._helpers.staticPath, this._config.get('server.static.options')));
        }

        //this._appInstance.use(bodyParser()); // TODO: сделать, чтобы работало

        this._appInstance.use(this.handle.bind(this));
    };

    async _generateNonce(context, next) {
        context.res.nonce = uuid();
        await next();
    }

    /**
     * Request logger.
     *
     * @param {Object} context
     * @param {Function} next
     *
     * @private
     */
    async _requestLogger(context, next) {
        const start = new Date();
        this._log.verbose('Request %s %s', context.method, context.url);
        await next();
        this._log.verbose('Response %s %s %s %s %s', context.method, context.url, context.status, ms(new Date() - start), bytes(context.response.length));
    }

    /**
     * Find registered route.
     *
     * @param {String} url
     * @param {String} method
     *
     * @return {Object}
     *
     * @private
     */
    _resolveRoute(url, method) {
        return this._router.resolve(url, method);
    }

    /**
     * Call route handler.
     *
     * @param {Object} resolvedRoute
     * @param {Object} context
     *
     * @return {*}
     *
     * @private
     */
    _callRouteHandler(resolvedRoute, context) {
        return resolvedRoute.handler(context);
    }

    /**
     * Responds to request by finding registered route or throwing 404 error.
     *
     * @param {Object} resolvedRoute
     * @param {Object} context
     *
     * @throws {HttpException} If there is no registered route action
     *
     * @return {{body: *, status: number}}
     *
     * @private
     */
    _executeRoute(resolvedRoute, context) {
        if (!resolvedRoute.handler) {
            throw new HttpException(`Route not found ${context.method} ${context.url}`, 404);
        }

        return {
            body: this._callRouteHandler(resolvedRoute, context),
            status: 200
        };
    }

    /**
     * Normalize error object by setting required parameters if they does not exists.
     *
     * @param {Error} error
     *
     * @return {Error}
     *
     * @private
     */
    _normalizeError(error) {
        error.status = error.status || 500;
        error.message = error.message || 'Internal server error';

        return error;
    }

    /**
     * Handles any errors thrown with in a given request and process them.
     *
     * @param {Error} error
     * @param {Object} context
     *
     * @return {{body: string, status: number}}
     *
     * @private
     */
    _handleError(error, context) {
        error = this._normalizeError(error);
        this._log.error(error.stack);

        let  body = `[${error.status}] ${error.name}: ${error.message}`;
        const resolvedRoute = this._resolveRoute(`/${error.status}`, context.method);

        if (resolvedRoute.handler) {
            try {
                body = this._callRouteHandler(resolvedRoute, context);
            } catch (error) {
                this._log.error(error.stack);
            }
        }

        return {
            body,
            status: error.status
        };
    }

    /**
     * Responds to a given HTTP request.
     *
     * @param {Object} context
     * @param {Object} respond
     *
     * @private
     */
    _respond(context, respond) {
        context.body = respond.body;
        context.status = respond.status;
    }

    /**
     * Request handler to respond to a given HTTP request.
     *
     * @param {Object} context
     *
     * @example
     * const app = new Koa();
     * app.use(Server.handle.bind(Server));
     *
     * @public
     */
    async handle(context) {
        let respond;

        try {
            const resolvedRoute = this._resolveRoute(context.url, context.method);
            respond = await this._executeRoute(resolvedRoute, context)
        } catch (error) {
            respond = await this._handleError(error, context);
        }

        this._respond(context, respond);
    }

    getInstance() {
        if (!this._appInstance) {
            this._registerApp();
        }

        return this._appInstance;
    }

    /**
     * Starting a server on a given port and host.
     *
     * @param {String} host
     * @param {Number} port
     *
     * @return {http.Server}
     *
     * @example
     * Server.listen('localhost', 3000);
     *
     * @public
     */
    listen(host, port) {
        this._log.info('Serving app on %s:%s', host, port);

        return this.getInstance().listen(port, host);
    }
}

export default Server.bind(null, Env, Config, Helpers);
