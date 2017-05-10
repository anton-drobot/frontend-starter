import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Logotype from 'app/modules/layout/components/Logotype';
import Navigation from 'app/modules/layout/components/Navigation';

const b = bem('Header');

@inject('router')
@observer
export default class Header extends Component {
    render() {
        return (
            <header className={b()}>
                <div className={b('wrapper')}>
                    <div className={b('logotype')}>
                        <Logotype />
                    </div>
                    <div className={b('navigation')}>
                        <Navigation />
                    </div>
                </div>
            </header>
        );
    }
}
