import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';

import Container from 'framework/IoC/Container';
import Registrar from 'framework/IoC/Registrar';

import { STORE_COLLECTION_PROVIDER } from 'framework/Providers/types';

import ClientLoggerProvider from 'framework/Providers/ClientLoggerProvider';

import { providers, registerApp, onRequest } from 'bootstrap/app';

global.Container = new Container();

new Registrar(global.Container)
    .register([
        ...providers,
        ClientLoggerProvider
    ])
    .then(async () => {
        const { default: App } = await import('app/modules/core/components/App');

        const StoreCollection = global.Container.make(STORE_COLLECTION_PROVIDER);

        /**
         * Register application.
         */
        await registerApp();
        await onRequest();

        const store = StoreCollection.store();
        store.router.go(window.location.href, { replace: true });

        hydrate(
            <Provider {...store}>
                <App />
            </Provider>,
            document.querySelector('#app')
        );

        //if (module.hot) {
        //    module.hot.accept('app/modules/core/components/App', async () => {
        //        render(
        //            <Provider {...stores}>
        //                <App />
        //            </Provider>,
        //            document.querySelector('#app')
        //        );
        //    });
        //}

        window.addEventListener('popstate', async () => {
            store.router.setLocation(window.location.href);
        }, false);
    })
    .catch((error) => {
        console.error(error);
    });
