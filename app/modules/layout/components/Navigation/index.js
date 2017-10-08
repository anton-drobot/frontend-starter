import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { appUrl } from 'framework/utils/url';
import { bem } from 'app/utils/bem';
import { HOME_PAGE, DEMO_PAGE } from 'app/routes';

import Link from 'app/modules/core/components/Link';

const b = bem('Navigation');

@observer
export default class Navigation extends Component {
    items() {
        return [
            { path: appUrl(HOME_PAGE), title: 'Найти квартиру' },
            { path: appUrl(DEMO_PAGE), title: 'Демо-страница' },
            { path: appUrl('/mortgage'), title: 'Ипотека' },
            { path: appUrl('/moving-house'), title: 'Переезд' },
            { path: appUrl('/home-improvement'), title: 'Ремонт' },
            { path: appUrl('/about'), title: 'О сервисе' }
        ];
    }

    render() {
        return (
            <nav className={b()}>
                <ul className={b('list')}>
                    {this.items().map((item) => (
                        <li className={b('listItem')} key={item.path}>
                            <Link href={item.path} className={b('link')}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}
