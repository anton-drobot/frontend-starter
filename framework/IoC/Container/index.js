import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';

/**
 * Inversion of Control Container.
 */
export default class Container {
    _bindings = new Map();
    _instances = new Map();
    _aliases = new Map();

    /**
     * Register a binding in the container
     *
     * @param {String} identifier
     * @param {Function} callback
     * @param {Boolean} shared
     * @param {Boolean} constant
     *
     * @throws {InvalidArgumentException}
     *
     * @private
     */
    _bind(identifier, callback, { shared, constant }) {
        if (Object.prototype.toString.call(identifier) !== '[object String]') {
            throw InvalidArgumentException.invalidParameter('Expected type "string" for the argument "identifier".');
        }

        if (this.has(identifier)) {
            throw InvalidArgumentException.invalidParameter(`Identifier "${identifier}" is already defined.`);
        }

        this._bindings.set(identifier, { callback, shared, constant });
    }

    /**
     * Returns the identifier associated with the alias, if one exists - or the given alias.
     *
     * @param {String} alias
     *
     * @return {String}
     *
     * @public
     */
    getIdentifier(alias) {
        if (this._aliases.has(alias)) {
            return this._aliases.get(alias);
        }

        return alias;
    }

    /**
     * Check if binding exists for identifier.
     *
     * @param {String} identifier
     * @param {Boolean} shouldCheckAlias
     *
     * @return {Boolean}
     *
     * @public
     */
    has(identifier, shouldCheckAlias = true) {
        if (shouldCheckAlias) {
            identifier = this.getIdentifier(identifier);
        }

        return this._bindings.has(identifier);
    }

    /**
     * Register a binding in this container, with a callback method.
     *
     * @param {String} identifier
     * @param {Function} callback
     *
     * @public
     */
    bind(identifier, callback) {
        this._bind(identifier, callback, { shared: false, constant: false });
    }

    /**
     * Register a singleton (shared) binding.
     *
     * @param {String} identifier
     * @param {Function} callback
     *
     * @public
     */
    singleton(identifier, callback) {
        this._bind(identifier, callback, { shared: true, constant: false });
    }

    /**
     * Register a constant value.
     *
     * @param {String} identifier
     * @param {*} callback
     *
     * @public
     */
    constant(identifier, callback) {
        this._bind(identifier, callback, { shared: false, constant: true });
    }

    /**
     * Assign an alias for the identifier.
     *
     * @param {String} alias
     * @param {String} identifier
     *
     * @throws {InvalidArgumentException}
     *
     * @public
     */
    alias(alias, identifier) {
        if (Object.prototype.toString.call(alias) !== '[object String]') {
            throw InvalidArgumentException.invalidParameter('Expected type "string" for the argument "alias".');
        }

        if (Object.prototype.toString.call(identifier) !== '[object String]') {
            throw InvalidArgumentException.invalidParameter('Expected type "string" for the argument "identifier".');
        }

        if (!this.has(identifier)) {
            throw InvalidArgumentException.invalidParameter(`Can not set alias "${alias}". Identifier "${identifier}" does not exists.`);
        }

        this._aliases.set(alias, identifier);
    }

    /**
     * Resolve the registered identifier from the container.
     *
     * @param {String} identifier
     * @param {Object} params
     *
     * @throws {InvalidArgumentException}
     *
     * @return {Class}
     *
     * @public
     */
    make(identifier, params = {}) {
        identifier = this.getIdentifier(identifier);

        if (this._instances.has(identifier)) {
            return this._instances.get(identifier);
        }

        if (!this.has(identifier, false)) {
            throw InvalidArgumentException.invalidParameter(`Identifier "${identifier}" does not exists.`);
        }

        const binding = this._bindings.get(identifier);

        if (binding.constant) {
            return binding.callback;
        }

        const instance = binding.callback(this, params);

        if (binding.shared) {
            this._instances.set(identifier, instance);
        }

        return instance;
    }
}
