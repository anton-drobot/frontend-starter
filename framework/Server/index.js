import Koa from 'koa';
import koaStatic from 'koa-static';
import helmet from 'koa-helmet';
import uuid from 'uuid/v4';
import bodyParser from 'koa-bodyparser';
import CatLog from 'cat-log';
import ms from 'ms';
import bytes from 'bytes';
import Env from '../Env';
import Config from '../Config';
import Helpers from '../Helpers';
import { normalizeError, RuntimeException } from '../Exceptions';

// Webpack
import webpack from 'webpack';
import webpackMiddleware from 'webpack-koa2-middleware';
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

        this._appInstance.use(bodyParser());

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
        this._log.verbose('--> %s %s', context.method, context.url);
        await next();
        this._log.verbose('<-- %s %s %s %s %s', context.method, context.url, context.status, ms(new Date() - start), bytes(context.response.length));
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
     * @return {Promise.<void>}
     *
     * @public
     */
    async handle(context) {
        const resolvedRoute = this._router.resolve(context.url, context.method);

        try {
            if (!resolvedRoute.handler) {
                throw RuntimeException.missingRoute(context.url, 404);
            }

            /**
             * Assign route path parameters to context.
             */
            context.params = resolvedRoute.params;
            context.body = await resolvedRoute.handler(context);
        } catch(error) {
            const normalizedError = normalizeError(error);
            context.status = normalizedError.status;
            this._log.error(normalizedError);
        }
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
