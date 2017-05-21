import Module from 'framework/Module';
import RouterStore from 'app/modules/router/stores/Router';

export default class RouterModule extends Module {
    moduleName() {
        return 'router';
    }

    register() {}

    registerStores() {
        return {
            router: RouterStore
        };
    }

    registerTranslations() {
        return {};
    }
}
