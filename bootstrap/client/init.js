import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';

import { STORE_COLLECTION_PROVIDER } from 'framework/Providers/types';

import { registerApp, onRequest } from 'app';
import App from 'app/modules/core/components/App';

/**
 * Initialize application.
 */
export default async function init() {
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

    window.addEventListener('popstate', () => {
        store.router.setLocation(window.location.href);
    }, false);
}
