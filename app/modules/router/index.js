import Module from 'framework/Module';
import RouterStore from 'app/modules/router/stores/Router';

export default class RouterModule extends Module {
    register() {}

    registerStores() {
        return [
            RouterStore
        ];
    }

    registerTranslations() {
        return [];
    }
}
