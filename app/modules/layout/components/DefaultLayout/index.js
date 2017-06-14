import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Header from 'app/modules/layout/components/Header';
import Footer from 'app/modules/layout/components/Footer';

const b = bem('DefaultLayout');

@observer
export default class DefaultLayout extends Component {
    render() {
        const {
            children
        } = this.props;

        return (
            <div className={b()}>
                <Header />
                <main className={b('wrapper')}>
                    {children}
                </main>
                <Footer />
            </div>
        );
    }
}
