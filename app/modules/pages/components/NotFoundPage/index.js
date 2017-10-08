import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import { bem } from 'app/utils/bem';

import DefaultLayout from 'app/modules/layout/components/DefaultLayout';

const b = bem('NotFoundPage');

@observer
export default class NotFoundPage extends Component {
    render() {
        return (
            <DefaultLayout>
                <Helmet>
                    <title>404 — Page Not Found</title>
                </Helmet>

                <section className={b()}>
                    Not Found — 404
                </section>
            </DefaultLayout>
        );
    }
}
