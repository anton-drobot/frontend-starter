import Store from 'framework/Store';
import MODULES from 'app/modules';
import ROUTES from 'app/routes';

function registerModules() {
    MODULES.forEach(function(Module) {
        new Module();
    });
}

function registerRoutes() {
    const store = Store.getStore();

    Object.keys(ROUTES).forEach((pageName) => {
        const { route, component } = ROUTES[pageName];
        store.router.register(route, component);
    });
}

export default function registerApp() {
    registerModules();
    registerRoutes();
}
