import ServiceProvider from '../../IoC/ServiceProvider';

import { CONFIG_PROVIDER } from '../types';

import URL from '../../Services/URL';

export default class URLProvider extends ServiceProvider {
    async register() {
        this.container.bind(CONFIG_PROVIDER, (container, { address }) => {
            const Config = container.make(CONFIG_PROVIDER);

            return new URL(Config, address);
        });
    }
}
