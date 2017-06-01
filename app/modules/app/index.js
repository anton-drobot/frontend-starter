import Module from 'framework/Module';

import SettingsStore from 'app/modules/app/stores/Settings';

export default class AppModule extends Module {
    register() {}

    registerStores() {
        return {
            settings: SettingsStore
        };
    }
}
