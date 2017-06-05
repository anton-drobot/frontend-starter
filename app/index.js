import Config from 'framework/Config';
import Store from 'framework/Store';
import Lang from 'framework/Lang';
import Module from 'framework/Module';

import ROUTES from 'app/routes';
import translations from 'app/i18n';
import modules from 'app/modules';

// Config
import appConfig from 'app/config/app';

function registerTranslations() {
    Lang.register(translations);
}

function setLocale() {
    const stores = Store.getStores();

    Lang.setLocale(stores.settings.locale);
}

function registerModules() {
    modules.forEach((Module) => {
        new Module();
    });
}

function registerRoutes() {
    const stores = Store.getStores();

    Object.keys(ROUTES).forEach((pageName) => {
        const { name, route, component } = ROUTES[pageName];
        stores.router.register(route, component, name);
    });
}

export default async function registerApp() {
    Config.registerConfig('app', appConfig);

    registerModules();
    registerTranslations();
    setLocale();
    registerRoutes();

    const modulesInstances = Module.getModules();

    for (let i = 0; i < modulesInstances.length; i++) {
        await modulesInstances[i].boot();
    }
}
