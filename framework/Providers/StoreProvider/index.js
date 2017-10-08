import ServiceProvider from '../../IoC/ServiceProvider';

import { STORE_PROVIDER } from '../types';

import Store from '../../Services/Store';

export default class StoreProvider extends ServiceProvider {
    async register() {
        this.container.constant(STORE_PROVIDER, Store);
    }
}
