/**
 * Abstract Service Provider.
 */
export default class ServiceProvider {
    /**
     * Create new service container instance.
     *
     * @param {Container} container — IoC Container instance.
     */
    constructor(container) {
        this.container = container;
    }

    /**
     *
     * Register all of this provider's services.
     *
     * @return {Promise.<void>}
     *
     * @public
     */
    async register() {}

    /**
     * Boot this provider.
     *
     * @return {Promise.<void>}
     *
     * @public
     */
    async boot() {}
}
