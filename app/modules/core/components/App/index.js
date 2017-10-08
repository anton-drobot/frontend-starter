import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { ENV_PROVIDER } from 'framework/Providers/types';

import { bem } from 'app/utils/bem';
import { HOME_PAGE, DEMO_PAGE } from 'app/routes';

import Router from 'app/modules/core/components/Router';
import Route from 'app/modules/core/components/Route';

import HomePage from 'app/modules/pages/components/HomePage';
import DemoPage from 'app/modules/pages/components/DemoPage';
import NotFoundPage from 'app/modules/pages/components/NotFoundPage';

const Env = global.Container.make(ENV_PROVIDER);

const b = bem('App');

@observer
export default class App extends Component {
    render() {
        return (
            <div className={b()}>
                <Router>
                    <Route route={HOME_PAGE} component={HomePage} />
                    <Route route={DEMO_PAGE} component={DemoPage} />
                    <Route httpStatus={404} component={NotFoundPage} />
                </Router>

                {Env.isDevelopment &&
                    <DevTools />
                }
            </div>
        );
    }
}
