import HomePage from 'app/modules/demo/components/HomePage';
import DemoPage from 'app/modules/demo/components/DemoPage';
import NotFound from 'app/modules/demo/components/NotFound';

const ROUTES = {
    HOME: {
        route: '/',
        component: HomePage
    },
    DEMO: {
        route: '/demo',
        component: DemoPage
    },
    DEMO_ID: {
        route: '/demo/:id',
        component: DemoPage
    },
    NOT_FOUND: {
        route: '/404',
        component: NotFound
    },
    INTERNAL_ERROR: {
        route: '/500',
        component: NotFound
    }
};

export default ROUTES;
