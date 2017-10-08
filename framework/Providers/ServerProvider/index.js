import ServiceProvider from '../../IoC/ServiceProvider';

import { ENV_PROVIDER, CONFIG_PROVIDER, LOGGER_PROVIDER, SERVER_PROVIDER } from '../types';

import Server from '../../Services/Server';

export default class ServerProvider extends ServiceProvider {
    async register() {
        this.container.singleton(SERVER_PROVIDER, (container, { Router }) => {
            const Env = container.make(ENV_PROVIDER);
            const Config = container.make(CONFIG_PROVIDER);
            const Logger = container.make(LOGGER_PROVIDER, { prefix: 'framework/Server' });

            return new Server(Env, Config, Logger, Router);
        });
    }
}
