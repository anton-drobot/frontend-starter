import Store from 'framework/Store';
import Lang from 'framework/Lang';

import MODULES from 'app/modules';
import ROUTES from 'app/routes';

function setLocale() {
    const store = Store.getStore();

    Lang.setLocale(store.settings.locale);
}

function registerModules() {
    MODULES.forEach(function(Module) {
        new Module();
    });
}

function registerRoutes() {
    const store = Store.getStore();

    Object.keys(ROUTES).forEach((pageName) => {
        const { name, route, component } = ROUTES[pageName];
        store.router.register(route, component, name);
    });
}

export default function registerApp() {
    registerModules();
    setLocale();
    registerRoutes();
}
