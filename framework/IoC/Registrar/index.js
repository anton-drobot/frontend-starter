export default class Registrar {
    _providers = new Map();
    _booted = new Map();

    /**
     * @param {Container} container — IoC Container instance.
     *
     * @return {Registrar}
     */
    constructor(container) {
        this.container = container;

        return this;
    }

    /**
     * Register a service provider.
     *
     * @param {ServiceProvider} Provider - Service provider which will be newed up.
     * @param {Boolean} [boot=true] - If true, provider's "boot" method will be triggered.
     *
     * @return {Promise.<ServiceProvider>}
     *
     * @public
     */
    async registerProvider(Provider, boot = true) {
        const instance = new Provider(this.container);

        if (!this._providers.has(instance.constructor.name)) {
            /**
             * Invoke register.
             */
            await instance.register();

            /**
             * Add provider to list of providers.
             */
            this._providers.set(instance.constructor.name, instance);
        }

        /**
         * Boot if needed.
         */
        if (boot) {
            await this.bootProvider(instance);
        }

        /**
         * Finally, return the registered instance.
         */
        return instance;
    }

    /**
     * Register a collection of service providers.
     *
     * @param {ServiceProvider[]} providers - Service providers which will be newed up.
     * @param {Boolean} [boot=true] - If true, provider's "boot" method will be triggered.
     *
     * @return {Promise.<void>}
     *
     * @public
     */
    async register(providers, boot = true) {
        const instances = await Promise.all(providers.map(async (provider) => await this.registerProvider(provider, false)));

        /**
         * Boot if needed.
         */
        if (boot) {
            await this.boot(instances);
        }
    }

    /**
     * Boot registered service provider.
     *
     * @param {ServiceProvider} instance - Instance of service provider which will be newed up.
     *
     * @return {Promise.<ServiceProvider>}
     *
     * @public
     */
    async bootProvider(instance) {
        if (!this._booted.has(instance.constructor.name)) {
            await instance.boot();

            /**
             * Add provider to list of booted providers.
             */
            this._booted.set(instance.constructor.name, instance);
        }

        return instance;
    }

    /**
     * Boot a collection of service providers.
     *
     * @param {ServiceProvider[]} instances - Instance of service providers which will be newed up.
     *
     * @return {Promise.<void>}
     *
     * @public
     */
    async boot(instances) {
        await Promise.all(instances.map(async (instance) => await this.bootProvider(instance)));
    }
}
