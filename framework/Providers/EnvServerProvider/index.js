import ServiceProvider from '../../IoC/ServiceProvider';

import { ENV_PROVIDER } from '../types';

import EnvServer from '../../Services/EnvServer';

export default class EnvServerProvider extends ServiceProvider {
    async register() {
        this.container.singleton(ENV_PROVIDER, () => new EnvServer());
    }
}
