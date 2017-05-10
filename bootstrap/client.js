import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import Config from 'framework/Config';
import Store from 'framework/Store';

import registerApp from 'app';
import App from 'app/modules/app/components/App';

// Config
import appConfig from 'app/config/app';

// Стили
import 'app/modules/app/components/App/index.scss';

function onLoad() {
    Config.registerConfig('app', appConfig);

    registerApp();

    const store = Store.getStore();
    store.router.setLocation(window.location.href);

    render(
        <Provider {...store}>
            <App />
        </Provider>,
        document.querySelector('#app')
    );

    document.removeEventListener('DOMContentLoaded', onLoad, true);
}

document.addEventListener('DOMContentLoaded', onLoad, true);
