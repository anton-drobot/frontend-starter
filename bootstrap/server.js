import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useStaticRendering } from 'mobx-react';
import CatLog from 'cat-log';

import ApiMethod from 'framework/ApiMethod';
import Env from 'framework/Env';
import Config from 'framework/Config';
import Server from 'framework/Server';
import Router from 'framework/Router';
import Store from 'framework/Store';
import Module from 'framework/Module';
import { normalizeError, ApiException } from 'framework/Exceptions';

// Config
import serverConfig from 'app/config/server';

import registerApp from 'app';
import apiMethods from 'app/api';
import App from 'app/modules/app/components/App';
import layout from 'app/views/layout';

const log = new CatLog('server');

/**
 * Start the server.
 */
export default function registerServer() {
    Config.registerConfig('server', serverConfig);

    // Register API Methods
    apiMethods.forEach((ApiMethod) => {
        new ApiMethod();
    });

    registerApp();

    const router = new Router();
    const server = new Server(router);

    /**
     * @see https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering
     */
    useStaticRendering(true);

    router.match(['GET', 'POST'], '/api/:name?', async (context) => {
        context.type = 'application/json';

        try {
            if (!context.params.name) {
                throw ApiException.missingMethodName(404);
            }

            const resolvedMethod = ApiMethod.resolveMethod(context.params.name, context.method);

            if (!resolvedMethod.handler) {
                throw ApiException.methodNotFound(context.params.name, 404);
            }

            return await resolvedMethod.handler(context);
        } catch (error) {
            const normalizedError = normalizeError(error);
            context.status = normalizedError.status;
            log.error(normalizedError);

            return { error: error.toJSON() };
        }
    });

    router.match(['GET', 'HEAD', 'POST'], '*', async (context) => {
        await Promise.all(Module.getModules().map(async (module) => {
            await module.boot();
        }));

        const stores = Store.getStores();
        await stores.router.setLocation(context.href);

        if (!stores.router.isRegisteredRoute(context.url)) {
            context.status = 404;
        }

        const markup = renderToString(
            <Provider {...stores}>
                <App />
            </Provider>
        );

        return layout(context, markup);
    });

    server.listen(Env.get('HOST'), Env.get('PORT'));
}
