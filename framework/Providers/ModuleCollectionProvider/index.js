import ServiceProvider from '../../IoC/ServiceProvider';

import { MODULE_COLLECTION_PROVIDER } from '../types';

import ModuleCollection from '../../Services/ModuleCollection';

export default class ModuleCollectionProvider extends ServiceProvider {
    async register() {
        this.container.singleton(MODULE_COLLECTION_PROVIDER, () => new ModuleCollection());
    }
}

