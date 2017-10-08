import ServiceProvider from '../../IoC/ServiceProvider';

import { LOGGER_PROVIDER } from '../types';

import ClientLogger from '../../Services/ClientLogger';

export default class ClientLoggerProvider extends ServiceProvider {
    async register() {
        this.container.bind(LOGGER_PROVIDER, (container, { prefix, level }) => new ClientLogger(prefix, level));
    }
}
