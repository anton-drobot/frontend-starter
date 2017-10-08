import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useStaticRendering } from 'mobx-react';
import { Helmet } from 'react-helmet';

import Container from 'framework/IoC/Container';
import Registrar from 'framework/IoC/Registrar';

import {
    ENV_PROVIDER,
    ROUTER_PROVIDER,
    SERVER_PROVIDER,
    STORE_COLLECTION_PROVIDER,
    CONFIG_PROVIDER
} from 'framework/Providers/types';

import ServerLoggerProvider from 'framework/Providers/ServerLoggerProvider';
import ServerProvider from 'framework/Providers/ServerProvider';

import { providers, registerApp, onRequest } from 'bootstrap/app';
import layout from 'app/views/layout';

import serverConfig from 'config/server';

global.Container = new Container();

/**
 * Start server instance.
 *
 * @return {Promise.<void>}
 */
export default function start() {
    new Registrar(global.Container)
        .register([
            ...providers,
            ServerLoggerProvider,
            ServerProvider
        ])
        .then(async () => {
            const { default: App } = await import('app/modules/core/components/App');

            const Config = global.Container.make(CONFIG_PROVIDER);
            const Env = global.Container.make(ENV_PROVIDER);
            const Router = global.Container.make(ROUTER_PROVIDER);
            const Server = global.Container.make(SERVER_PROVIDER, { Router });
            const StoreCollection = global.Container.make(STORE_COLLECTION_PROVIDER);

            Config.register('server', serverConfig);

            /**
             * @see https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering
             */
            useStaticRendering(true);

            /**
             * Register application on each request.
             */
            await registerApp();

            Router.match(['GET', 'HEAD', 'POST'], '(.*)', async (context) => {
                await onRequest();

                const store = StoreCollection.store();

                context.type = 'text/html';
                context.status = store.router.isApplicationUrl(context.href) ? 200 : 404;

                store.router.go(context.href, { replace: true });
                store.router.setHttpStatus(context.status);

                const markup = renderToString(
                    <Provider {...store}>
                        <App />
                    </Provider>
                );

                const helmet = Helmet.renderStatic();

                return layout(context, markup, helmet, StoreCollection);
            });

            Server.listen(Env.get('HOST'), Env.get('PORT'));
        })
        .catch((err) => {
            console.error(err);
        });
}
