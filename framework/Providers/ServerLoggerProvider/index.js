import ServiceProvider from '../../IoC/ServiceProvider';

import { LOGGER_PROVIDER } from '../types';

import ServerLogger from '../../Services/ServerLogger';

export default class ServerLoggerProvider extends ServiceProvider {
    async register() {
        this.container.bind(LOGGER_PROVIDER, (container, { prefix, level }) => new ServerLogger(prefix, level));
    }
}
