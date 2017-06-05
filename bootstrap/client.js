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

    const modulesInstances = Module.getModules();

    for (let i = 0; i < modulesInstances.length; i++) {
        await modulesInstances[i].boot();
    }

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
