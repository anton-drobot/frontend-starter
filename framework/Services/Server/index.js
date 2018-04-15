import Koa from 'koa';
import helmet from 'koa-helmet';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import uuid from 'uuid/v4';
import ms from 'ms';
import bytes from 'bytes';
import escape from 'lodash/escape';

import webpack from 'webpack';
import { devMiddleware } from 'koa-webpack-middleware';
import webpackConfig from 'webpack.config';

import { normalizeError } from '../../utils/errors';
import RuntimeException from '../../Exceptions/RuntimeException';

export default class Server {
    _appInstance;

    /**
     * @param {EnvServer} Env - Dependency.
     * @param {Config} Config - Dependency.
     * @param {Logger} Logger - Dependency.
     * @param {Router} Router
     */
    constructor(Env, Config, Logger, Router) {
        this._env = Env;
        this._config = Config;
        this._logger = Logger;
        this._router = Router;
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

        if (this._config.get('server.helmet')) {
            this._appInstance.use(helmet(this._config.get('server.helmet')));
        }

        /**
         * Request logger.
         */
        this._appInstance.use(this._requestLogger.bind(this));

        /**
         * Webpack.
         */
        if (this._env.isDevelopment) {
            const compiler = webpack(webpackConfig);

            this._appInstance.use(devMiddleware(compiler, {
                noInfo: true,
                lazy: true,
                publicPath: webpackConfig.output.publicPath,
                stats: 'errors-only',
            }));

            /*
            this._appInstance.use(hotMiddleware(compiler, {
                path: '/assets/__webpack_hmr'
            }));
            */
        }

        /**
         * Serves static resource using static server.
         */
        if (this._config.get('server.static')) {
            this._appInstance.use(koaStatic(this._config.get('server.static.path'), this._config.get('server.static.options')));
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
        context.state.requestTime = new Date();
        this._logger.verbose('--> %s %s', context.method, context.url);
        await next();
        context.state.responseTime = new Date();
        this._logger.verbose('<-- %s %s %s %s %s', context.method, context.url, context.status, ms(context.state.responseTime - context.state.requestTime), bytes(context.response.length));
    }

    /**
     * Request handler to respond to a given HTTP request.
     *
     * @param {Object} context
     *
     * @return {Promise.<void>}
     *
     * @example
     * const app = new Koa();
     * app.use(Server.handle.bind(Server));
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

            if (this._env.isDevelopment) {
                context.body = `<!DOCTYPE html>
                                <html>
                                    <head>
                                        <meta charset="utf-8">
                                    </head>
                                    <body>
                                        <pre>${escape(error.stack)}</pre>
                                    </body>
                                </html>`;
            }

            this._logger.error(normalizedError);
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
     * @param {String} [host='localhost']
     * @param {Number} [port=3000]
     *
     * @return {http.Server}
     *
     * @example
     * Server.listen('localhost', 3000);
     *
     * @public
     */
    listen(host = 'localhost', port = 3000) {
        this._logger.info('Serving app on %s:%s', host, port);

        return this.getInstance().listen(port, host);
    }
}
