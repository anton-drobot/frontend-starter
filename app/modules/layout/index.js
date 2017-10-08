import { MODULE_PROVIDER } from 'framework/Providers/types';

const Module = global.Container.make(MODULE_PROVIDER);

export default class LayoutModule extends Module {
    register() {}

    boot() {}

    registerStores() {
        return {};
    }
}
