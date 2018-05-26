import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Loadable from 'react-loadable';

import { bem } from 'app/utils/bem';
import { HOME_PAGE, DEMO_PAGE } from 'app/routes';

import Router from 'app/modules/core/components/Router';
import Route from 'app/modules/core/components/Route';

const b = bem('App');

function Loading(props) {
    if (props.error) {
        return <div>Error!</div>;
    } else if (props.timedOut) {
        return <div>Taking a long time...</div>;
    } else if (props.pastDelay) {
        return <div>Loading...</div>;
    }

    return null;
}

const LoadableHomePage = Loadable({
    loader: () => import(
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "home-page" */
        'app/modules/pages/components/HomePage'
    ),
    loading: Loading,
    delay: 300,
    timeout: 10000
});

const LoadableDemoPage = Loadable({
    loader: () => import(
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "demo-page" */
        'app/modules/pages/components/DemoPage'
    ),
    loading: Loading,
    delay: 300,
    timeout: 10000
});

const LoadableNotFoundPage = Loadable({
    loader: () => import(
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "not-found" */
        'app/modules/pages/components/NotFoundPage'
    ),
    loading: Loading,
    delay: 300,
    timeout: 10000
});

@observer
export default class App extends Component {
    render() {
        return (
            <div className={b()}>
                <Router>
                    <Route route={HOME_PAGE} component={LoadableHomePage} />
                    <Route route={DEMO_PAGE} component={LoadableDemoPage} />
                    <Route httpStatus={404} component={LoadableNotFoundPage} />
                </Router>
            </div>
        );
    }
}
