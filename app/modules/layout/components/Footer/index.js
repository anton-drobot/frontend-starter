import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Copyright from 'app/modules/layout/components/Copyright';

const b = bem('Footer');

@observer
export default class Footer extends Component {
    render() {
        return (
            <footer className={b()}>
                <div className={b('wrapper')}>
                    <Copyright />
                </div>
            </footer>
        );
    }
}
