import { observable, action } from 'mobx';

import Config from 'framework/Config';
import Store from 'framework/Store';

export default class SettingsStore extends Store {
    @observable locale = Config.get('app.locale');

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
