import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useStaticRendering } from 'mobx-react';

import Env from 'framework/Env';
import Config from 'framework/Config';
import Server from 'framework/Server';
import Router from 'framework/Router';
import Store from 'framework/Store';

// Config
import serverConfig from 'app/config/server';
import appConfig from 'app/config/app';

import registerApp from 'app';
import App from 'app/modules/app/components/App';
import layout from 'app/views/layout';

function handler(context, location) {
    registerApp();

    const store = Store.getStore();
    store.router.setLocation(location);

    const markup = renderToString(
        <Provider {...store}>
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
    Config.registerConfig('app', appConfig);

    const router = new Router();
    const server = new Server(router);

    /**
     * @see https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering
     */
    useStaticRendering(true);

    router.match(['GET', 'HEAD', 'POST'], '(^404|500)*', (context) => {
        return handler(context, context.href);
    });

    router.any('/404', (context) => {
        return handler(context, '/404');
    });

    router.any('/500', (context) => {
        return handler(context, '/500');
    });

    server.listen(Env.get('HOST'), Env.get('PORT'));
}
