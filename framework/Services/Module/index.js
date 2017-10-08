export default class Module {
    /**
     * Register method, called when application started.
     */
    async register() {}

    /**
     * Boot method, called right before the request route.
     */
    async boot() {}

    /**
     * Registers any stores.
     *
     * @return {Object}
     */
    async registerStore () {
        return {};
    }
}
