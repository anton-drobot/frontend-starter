import { MODULE_PROVIDER } from 'framework/Providers/types';

import RouterStore from 'app/modules/core/stores/Router';
import SettingsStore from 'app/modules/core/stores/Settings';

const Module = global.Container.make(MODULE_PROVIDER);

export default class CoreModule extends Module {
    register() {}

    boot() {}

    registerStores() {
        return {
            router: RouterStore,
            settings: SettingsStore
        };
    }
}
