import { observable, action } from 'mobx';
import Config from 'framework/Config';

export default class SettingsStore {
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
