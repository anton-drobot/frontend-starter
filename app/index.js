import Config from 'framework/Config';
import Store from 'framework/Store';
import Lang from 'framework/Lang';

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

export default function registerApp() {
    Config.registerConfig('app', appConfig);

    registerModules();
    registerTranslations();
    setLocale();
    registerRoutes();
}
