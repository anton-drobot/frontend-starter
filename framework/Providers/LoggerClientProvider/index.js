import ServiceProvider from '../../IoC/ServiceProvider';

import { LOGGER_PROVIDER } from '../types';

import LoggerClient from '../../Services/LoggerClient';

export default class LoggerClientProvider extends ServiceProvider {
    async register() {
        this.container.bind(LOGGER_PROVIDER, (container, { prefix, level }) => new LoggerClient(prefix, level));
    }
}
