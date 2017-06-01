import glob from 'glob';

import Store from 'framework/Store';
import Lang from 'framework/Lang';

import ROUTES from 'app/routes';

function registerTranslations() {
    const files = glob.sync('app/i18n/**/*.js', { nodir: true });

    files.forEach((path) => {
        // Destructing to "module" and "locale", because webpack throws warning
        const locale = path.slice(path.lastIndexOf('/') + 1, -3);
        const module = path.substring(path.lastIndexOf('/'), 0).split('/')[2];
        const translations = require(`app/i18n/${module}/${locale}`).default;
        Lang.register(module, locale, translations);
    });
}

function setLocale() {
    const store = Store.getStore();

    Lang.setLocale(store.settings.locale);
}

function registerModules() {
    const files = glob.sync('app/modules/*/index.js', { nodir: true });

    files.forEach((path) => {
        const moduleName = path.split('/')[2];
        const Module = require(`app/modules/${moduleName}`).default;
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
    registerTranslations();
    registerModules();
    setLocale();
    registerRoutes();
}
