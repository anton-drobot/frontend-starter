import Store from 'framework/Store';

export default class Module {
    constructor() {
        const stores = this.registerStores();

        Object.keys(stores).forEach((name) => {
            Store.register(name, stores[name]);
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
     * @return {Object}
     */
    registerStores() {
        return {};
    }
}
