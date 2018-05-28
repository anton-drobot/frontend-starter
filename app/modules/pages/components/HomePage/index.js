import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import { bem } from 'app/libs/bem';

import DefaultLayout from 'app/modules/layout/components/DefaultLayout';

const b = bem('DefaultLayout');

@observer
export default class HomePage extends Component {
    render() {
        return (
            <DefaultLayout>
                <Helmet>
                    <title>Home Page</title>
                </Helmet>

                <section className={b()}>
                    HomePage
                </section>
            </DefaultLayout>
        );
    }
}
