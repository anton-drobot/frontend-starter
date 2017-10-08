import ServiceProvider from '../../IoC/ServiceProvider';

import { LANG_PROVIDER } from '../types';

import Lang from '../../Services/Lang';

export default class LangProvider extends ServiceProvider {
    async register() {
        this.container.singleton(LANG_PROVIDER, () => new Lang());
    }
}
