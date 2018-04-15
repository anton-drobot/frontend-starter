import ServiceProvider from '../../IoC/ServiceProvider';

import { LOGGER_PROVIDER } from '../types';

import LoggerServer from '../../Services/LoggerServer';

export default class LoggerServerProvider extends ServiceProvider {
    async register() {
        this.container.bind(LOGGER_PROVIDER, (container, { prefix, level }) => new LoggerServer(prefix, level));
    }
}
