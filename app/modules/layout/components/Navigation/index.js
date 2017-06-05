import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { bem } from 'app/utils/bem';
import { appUrl } from 'framework/utils/url';

import Link from 'app/modules/core/components/Link';

const b = bem('Navigation');

@inject('router')
@observer
export default class Navigation extends Component {
    items() {
        const { router } = this.props;
        const ROUTES = router.getRoutes();

        return [
            { path: appUrl(ROUTES.HOME), title: 'Home' },
            { path: appUrl(ROUTES.DEMO), title: 'Demo Page' },
            { path: appUrl(ROUTES.DEMO_ID, { id: 12 }), title: 'Demo Page (id = 12)' },
            { path: appUrl('/hello'), title: 'Hello (Not Exists)' },
            { path: appUrl('/hello.txt'), title: 'hello.txt' }
        ];
    }

    render() {
        return (
            <nav className={b()}>
                <ul className={b('list')}>
                    {this.items().map((item) => (
                        <li className={b('listItem')} key={item.path}>
                            <Link to={item.path} className={b('link')}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}
