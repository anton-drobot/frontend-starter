import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Lang from 'framework/Lang';

import DefaultLayout from 'app/modules/layout/components/DefaultLayout';

@observer
export default class NotFound extends Component {
    render() {
        return (
            <DefaultLayout>
                <div>{Lang.get('demo.notFound')}</div>
            </DefaultLayout>
        );
    }
}
