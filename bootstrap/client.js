import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import Store from 'framework/Store';

import registerApp from 'app';
import App from 'app/modules/app/components/App';
import Module from 'framework/Module';

// Стили
import 'app/modules/app/components/App/index.scss';

async function onLoad() {
    registerApp();

    await Promise.all(Module.getModules().map(async (module) => {
        await module.boot();
    }));

    const stores = Store.getStores();
    await stores.router.setLocation(window.location.href);

    render(
        <Provider {...stores}>
            <App />
        </Provider>,
        document.querySelector('#app')
    );

    document.removeEventListener('DOMContentLoaded', onLoad, true);
}

document.addEventListener('DOMContentLoaded', onLoad, true);

window.addEventListener('popstate', async function () {
    const stores = Store.getStores();
    await stores.router.setLocation(window.location.href);
}, false);
