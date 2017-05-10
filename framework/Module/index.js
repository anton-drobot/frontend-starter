import Lang from 'framework/Lang';
import Store from 'framework/Store';

export default class Module {
    constructor() {
        const translations = this.registerTranslations();
        const stores = this.registerStores();

        stores.forEach((StoreClass) => {
            Store.register(StoreClass);
        });

        this.register();
    }

    /**
     * Boot method, called right before the request route.
     */
    register() {}

    /**
     * Registers any stores.
     *
     * @return {Array}
     */
    registerStores() {
        return [];
    }

    /**
     * Register any translations.
     *
     * @return {Array}
     */
    registerTranslations() {
        return [];
    }
}
