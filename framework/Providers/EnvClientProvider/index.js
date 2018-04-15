import ServiceProvider from '../../IoC/ServiceProvider';

import { ENV_PROVIDER } from '../types';

import EnvClient from '../../Services/EnvClient';

export default class EnvClientProvider extends ServiceProvider {
    async register() {
        this.container.singleton(ENV_PROVIDER, () => new EnvClient());
    }
}
