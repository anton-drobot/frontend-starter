import Config from 'framework/Config';
import Store from 'framework/Store';
import Lang from 'framework/Lang';
import Module from 'framework/Module';

import RouterComponent from 'app/modules/router/components/Router';
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
    stores.router.registerRoutes(RouterComponent.getRoutes());
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
