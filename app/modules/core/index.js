import Module from 'framework/Module';

export default class CoreModule extends Module {
    moduleName() {
        return 'core';
    }

    register() {}

    registerStores() {
        return {};
    }

    registerTranslations() {
        return {};
    }
}
