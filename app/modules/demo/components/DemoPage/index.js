import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Lang from 'framework/Lang';

import DefaultLayout from 'app/modules/layout/components/DefaultLayout';

@observer
export default class DemoPage extends Component {
    render() {
        return (
            <DefaultLayout>
                <div>{Lang.get('demo.demoPage')}</div>
            </DefaultLayout>
        );
    }
}
