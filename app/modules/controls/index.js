import { MODULE_PROVIDER } from 'framework/Providers/types';

import UiStateStore from 'app/modules/controls/stores/UiState';

const Module = global.Container.make(MODULE_PROVIDER);

export default class ControlsModule extends Module {
    register() {}

    boot() {}

    registerStores() {
        return {
            uiState: UiStateStore
        };
    }
}
