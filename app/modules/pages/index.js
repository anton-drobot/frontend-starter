import { MODULE_PROVIDER } from 'framework/Providers/types';

const Module = global.Container.make(MODULE_PROVIDER);

export default class PagesModule extends Module {
    register() {}

    boot() {}

    registerStores() {
        return {};
    }
}
