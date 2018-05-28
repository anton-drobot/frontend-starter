/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useStaticRendering } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'

import {
    ENV_PROVIDER,
    ROUTER_PROVIDER,
    SERVER_PROVIDER,
    STORE_COLLECTION_PROVIDER,
    CONFIG_PROVIDER
} from 'framework/Providers/types';

import { registerApp, onRequest } from 'app';
import layout from 'app/views/layout';
import App from 'app/modules/core/components/App';

import serverConfig from 'config/server';

/**
 * Initialize application.
 *
 * @param {Container} iocContainer
 *
 * @return {Promise<void>}
 */
export default async function init(iocContainer) {
    const Config = iocContainer.make(CONFIG_PROVIDER);
    const Env = iocContainer.make(ENV_PROVIDER);
    const Router = iocContainer.make(ROUTER_PROVIDER);
    const Server = iocContainer.make(SERVER_PROVIDER, { Router });
    const StoreCollection = iocContainer.make(STORE_COLLECTION_PROVIDER);

    Config.register('server', serverConfig);

    /**
     * @see https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering
     */
    useStaticRendering(true);

    /**
     * Register application on each request.
     */
    await registerApp(iocContainer);

    Router.match(['GET', 'HEAD', 'POST'], '(.*)', async (context) => {
        await onRequest(iocContainer);

        const modules = [];
        const store = StoreCollection.store();

        context.type = 'text/html';
        context.status = store.router.isApplicationUrl(context.href) ? 200 : 404;

        store.router.go(context.href, { replace: true });
        store.router.setHttpStatus(context.status);

        const markup = renderToString(
            <Capture report={moduleName => modules.push(moduleName)}>
                <Provider {...store}>
                    <App />
                </Provider>
            </Capture>
        );

        const helmet = Helmet.renderStatic();
        const stats = await import('build/react-loadable.json');
        const bundles = getBundles(stats, modules);

        return layout(context, markup, helmet, bundles, StoreCollection);
    });

    Server.listen(Env.get('HOST'), Env.get('PORT'));
}
