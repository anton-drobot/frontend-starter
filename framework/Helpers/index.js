const Helpers = {
    _paths: {
        app: 'app',
        config: 'app/config',
        modules: 'app/modules',
        static: 'static'
    },

    get configPath() {
        return this._paths.config;
    },

    set configPath(path) {
        return this._paths.config = path;
    },

    get staticPath() {
        return this._paths.static;
    },

    set staticPath(path) {
        return this._paths.static = path;
    }
};

export default Helpers;
