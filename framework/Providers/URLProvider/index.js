import ServiceProvider from '../../IoC/ServiceProvider';

import { CONFIG_PROVIDER, URL_PROVIDER } from '../types';

import URL from '../../Services/URL';

export default class URLProvider extends ServiceProvider {
    async register() {
        /*this.container.bind(URL_PROVIDER, (container, { address }) => {
            const Config = container.make(CONFIG_PROVIDER);

            return new URL(Config, address);
        });*/
        this.container.bind(URL_PROVIDER, (container) => {
            const Config = container.make(CONFIG_PROVIDER);

            return URL.bind(null, Config);
        });
    }
}
