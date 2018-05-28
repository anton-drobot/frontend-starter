import React from 'react';
import Loadable from 'react-loadable';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';

import { STORE_COLLECTION_PROVIDER } from 'framework/Providers/types';

import { registerApp, onRequest } from 'app';
import App from 'app/modules/core/components/App';

/**
 * Initialize application.
 *
 * @param {Container} iocContainer
 *
 * @return {Promise<void>}
 */
export default async function init(iocContainer) {
    await Loadable.preloadReady();

    const StoreCollection = iocContainer.make(STORE_COLLECTION_PROVIDER);

    /**
     * Register application.
     */
    await registerApp(iocContainer);
    await onRequest(iocContainer);

    const store = StoreCollection.store();
    store.router.go(window.location.href, { replace: true });

    hydrate(
        <Provider {...store}>
            <App />
        </Provider>,
        document.querySelector('#app')
    );

    window.addEventListener('popstate', () => {
        store.router.setLocation(window.location.href);
    }, false);
}
