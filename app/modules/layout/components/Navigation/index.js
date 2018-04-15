import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { URL_PROVIDER } from 'framework/Providers/types';
import { bem } from 'app/utils/bem';
import { HOME_PAGE, DEMO_PAGE } from 'app/routes';

import Link from 'app/modules/core/components/Link';

const URL = global.Container.make(URL_PROVIDER);
const b = bem('Navigation');

@observer
export default class Navigation extends Component {
    items() {
        return [
            { path: (new URL).makeApp(HOME_PAGE), title: 'Найти квартиру' },
            { path: (new URL).makeApp(DEMO_PAGE), title: 'Демо-страница' },
            { path: (new URL).makeApp('/mortgage'), title: 'Ипотека' },
            { path: (new URL).makeApp('/moving-house'), title: 'Переезд' },
            { path: (new URL).makeApp('/home-improvement'), title: 'Ремонт' },
            { path: (new URL).makeApp('/about'), title: 'О сервисе' }
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
