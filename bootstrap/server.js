import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useStaticRendering } from 'mobx-react';

import Api from 'framework/Api';
import Env from 'framework/Env';
import Config from 'framework/Config';
import Server from 'framework/Server';
import Router from 'framework/Router';
import Store from 'framework/Store';

// Config
import serverConfig from 'app/config/server';

import registerApp from 'app';
import apiMethods from 'app/api';
import App from 'app/modules/app/components/App';
import layout from 'app/views/layout';

/**
 * @todo Возвращать ошибку и статус 500
 */
async function apiHandler(context) {
    context.type = 'application/json';

    apiMethods.forEach((ApiMethod) => {
        new ApiMethod();
    });

    const resolvedMethod = Api.getMethods()
        .find((apiMethod) => apiMethod.name === context.params.method && apiMethod.method === context.method);

    if (resolvedMethod) {
        try {
            return await resolvedMethod.handler(context);
        } catch(err) {
            return { error: 'internal_error', message: err.message };
        }
    }

    return { error: 'internal_error', message: 'API method not found' };
}

async function handler(context) {
    await registerApp();

    const stores = Store.getStores();
    stores.router.setLocation(context.href);

    const markup = renderToString(
        <Provider {...stores}>
            <App />
        </Provider>
    );

    return layout(context, markup);
}

/**
 * Start the server.
 */
export default function registerServer() {
    Config.registerConfig('server', serverConfig);

    const router = new Router();
    const server = new Server(router);

    /**
     * @see https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering
     */
    useStaticRendering(true);

    router.match(['GET', 'POST'], '/api/:method', apiHandler);

    router.match(['GET', 'HEAD', 'POST'], '*', handler);

    /*
    router.match(['GET', 'HEAD', 'POST'], '(^404|500)*', (context) => {
        return handler(context, context.href);
    });

    router.any('/404', (context) => {
        return handler(context, '/404');
    });

    router.any('/500', (context) => {
        return handler(context, '/500');
    });
    */

    server.listen(Env.get('HOST'), Env.get('PORT'));
}
