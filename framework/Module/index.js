import Store from 'framework/Store';

export default class Module {
    static _modules = [];

    static getModules() {
        return Module._modules;
    }

    constructor() {
        Module._modules.push(this);

        const stores = this.registerStores();

        Object.keys(stores).forEach((name) => {
            Store.register(name, stores[name]);
        });
    }

    /**
     * Boot method, called right before the request route.
     */
    boot() {}

    /**
     * Registers any stores.
     *
     * @return {Object}
     */
    registerStores() {
        return {};
    }
}
