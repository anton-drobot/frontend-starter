export default class ModuleCollection {
    _modules = new Map();

    /**
     * Get all modules.
     *
     * @return {Map}
     */
    modules() {
        return this._modules;
    }

    /**
     * Get all modules as Array.
     *
     * @return {Array}
     */
    toArray() {
        return Array.from(this.modules());
    }

    /**
     * Register module.
     *
     * @param {String} identifier - Module name.
     * @param {Module} module - Module instance.
     */
    set(identifier, module) {
        this._modules[identifier] = module;
    }
}
