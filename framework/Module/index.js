import Lang from 'framework/Lang';
import Store from 'framework/Store';

export default class Module {
    constructor() {
        const translations = this.registerTranslations();
        const stores = this.registerStores();

        Lang.register(this.moduleName(), translations);

        Object.keys(stores).forEach((name) => {
            Store.register(name, stores[name]);
        });

        this.register();
    }

    /**
     * Module name.
     *
     * @return {String}
     */
    moduleName() {
        return '';
    }

    /**
     * Boot method, called right before the request route.
     */
    register() {}

    /**
     * Registers any stores.
     *
     * @return {Object}
     */
    registerStores() {
        return {};
    }

    /**
     * Register any translations.
     *
     * @return {Object}
     */
    registerTranslations() {
        return {};
    }
}
