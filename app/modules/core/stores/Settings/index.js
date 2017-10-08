import { observable, action } from 'mobx';
import { serializable } from 'serializr';

import { CONFIG_PROVIDER, STORE_PROVIDER } from 'framework/Providers/types';

const Config = global.Container.make(CONFIG_PROVIDER);
const Store = global.Container.make(STORE_PROVIDER);

export default class SettingsStore extends Store {
    @serializable @observable locale = Config.get('app.locale');

    /**
     * Set application locale.
     *
     * @param {String} locale
     */
    @action
    setLocale(locale) {
        this.locale = locale;
    }
}
