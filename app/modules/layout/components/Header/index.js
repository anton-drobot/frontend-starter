import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

import Logotype from 'app/modules/layout/components/Logotype';
import Navigation from 'app/modules/layout/components/Navigation';

const b = bem('Header');

@observer
export default class Header extends Component {
    render() {
        return (
            <header className={b()}>
                <div className={b('wrapper')}>
                    <div className={b('container')}>
                        <div className={b('logotype')}>
                            <Logotype />
                        </div>
                        <div className={b('navigation')}>
                            <Navigation />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
