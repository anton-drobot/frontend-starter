import Module from 'framework/Module';

import SettingsStore from 'app/modules/app/stores/Settings';

export default class AppModule extends Module {
    moduleName() {
        return 'app';
    }

    register() {}

    registerStores() {
        return {
            settings: SettingsStore
        };
    }

    registerTranslations() {
        return {};
    }
}
