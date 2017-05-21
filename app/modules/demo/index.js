import Module from 'framework/Module';

import en from 'app/modules/demo/lang/en';
import ru from 'app/modules/demo/lang/ru';

export default class DemoModule extends Module {
    moduleName() {
        return 'demo';
    }

    register() {}

    registerStores() {
        return {};
    }

    registerTranslations() {
        return {
            en,
            ru
        };
    }
}
