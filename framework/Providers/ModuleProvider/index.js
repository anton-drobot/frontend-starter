import ServiceProvider from '../../IoC/ServiceProvider';

import { MODULE_PROVIDER } from '../types';

import Module from '../../Services/Module';

export default class ModuleProvider extends ServiceProvider {
    async register() {
        this.container.constant(MODULE_PROVIDER, Module);
    }
}
