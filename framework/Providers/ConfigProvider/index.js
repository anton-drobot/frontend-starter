import ServiceProvider from '../../IoC/ServiceProvider';

import { CONFIG_PROVIDER } from '../types';

import Config from '../../Services/Config';

export default class ConfigProvider extends ServiceProvider {
    async register() {
        this.container.singleton(CONFIG_PROVIDER, () => new Config());
    }
}
