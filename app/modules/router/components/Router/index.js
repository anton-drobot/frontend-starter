import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

// Routes
import HomePage from 'app/modules/demo/components/HomePage';
import DemoPage from 'app/modules/demo/components/DemoPage';
import NotFound from 'app/modules/demo/components/NotFound';

@inject('router')
@observer
export default class Router extends Component {
    static ROUTES = {
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
        }
        /*
        INTERNAL_ERROR: {
            name: Symbol('INTERNAL_ERROR'),
            route: '/500',
            component: NotFound
        }
        */
    };

    static getRoutes() {
        return Router.ROUTES;
    }

    render() {
        const { router } = this.props;
        const resolvedRoute = router.route;

        if (!resolvedRoute.handler) {
            return null;
        }

        const Component = resolvedRoute.handler;

        return <Component />;
    }
}
