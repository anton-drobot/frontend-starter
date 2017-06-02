import Store from 'framework/Store';
import Lang from 'framework/Lang';

import ROUTES from 'app/routes';
import translations from 'app/i18n';
import modules from 'app/modules';

function registerTranslations() {
    Lang.register(translations);
}

function setLocale() {
    const store = Store.getStore();

    Lang.setLocale(store.settings.locale);
}

function registerModules() {
    modules.forEach((Module) => {
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
    registerTranslations();
    setLocale();
    registerRoutes();
}
