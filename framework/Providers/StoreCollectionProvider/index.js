import ServiceProvider from '../../IoC/ServiceProvider';

import { STORE_COLLECTION_PROVIDER, ENV_PROVIDER } from '../types';

import StoreCollection from '../../Services/StoreCollection';

export default class StoreCollectionProvider extends ServiceProvider {
    async register() {
        this.container.singleton(STORE_COLLECTION_PROVIDER, (container) => {
            const Env = container.make(ENV_PROVIDER);

            return new StoreCollection(Env);
        });
    }
}
