import HomePage from 'app/modules/demo/components/HomePage';
import DemoPage from 'app/modules/demo/components/DemoPage';
import NotFound from 'app/modules/demo/components/NotFound';

const ROUTES = {
    HOME: {
        name: Symbol('home'),
        route: '/',
        component: HomePage
    },
    DEMO: {
        name: Symbol('demo'),
        route: '/demo',
        component: DemoPage
    },
    DEMO_ID: {
        name: Symbol('demo-id'),
        route: '/demo/:id',
        component: DemoPage
    },
    NOT_FOUND: {
        name: Symbol('not-found'),
        route: '/404',
        component: NotFound
    },
    INTERNAL_ERROR: {
        name: Symbol('internal-error'),
        route: '/500',
        component: NotFound
    }
};

export default ROUTES;
