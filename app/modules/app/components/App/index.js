import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Header from 'app/modules/layout/components/Header';
import Footer from 'app/modules/layout/components/Footer';
import Router from 'app/modules/router/components/Router';

const b = bem('App');

@observer
export default class App extends Component {
    render() {
        return (
            <div className={b()}>
                <Header />
                <main className={b('content')}>
                    <div className={b('wrapper')}>
                        <Router />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}
