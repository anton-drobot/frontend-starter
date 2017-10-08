import ServiceProvider from '../../IoC/ServiceProvider';

import { ROUTER_PROVIDER } from '../types';

import Router from '../../Services/Router';

export default class RouterProvider extends ServiceProvider {
    async register() {
        this.container.bind(ROUTER_PROVIDER, () => new Router());
    }
}

