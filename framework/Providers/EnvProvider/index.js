import ServiceProvider from '../../IoC/ServiceProvider';

import { ENV_PROVIDER } from '../types';

import Env from '../../Services/Env';

export default class EnvProvider extends ServiceProvider {
    async register() {
        this.container.singleton(ENV_PROVIDER, () => new Env());
    }
}
