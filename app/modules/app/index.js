import Module from 'framework/Module';

import SettingsStore from 'app/modules/app/stores/Settings';

export default class AppModule extends Module {
    boot() {}

    registerStores() {
        return {
            settings: SettingsStore
        };
    }
}
