import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Router from 'app/modules/router/components/Router';

const b = bem('App');

@observer
export default class App extends Component {
    render() {
        return (
            <div className={b()}>
                <Router />
            </div>
        );
    }
}
