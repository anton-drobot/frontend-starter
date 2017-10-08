import React from 'react';
import { observer, inject } from 'mobx-react';

import { appUrl } from 'framework/utils/url';
import { bem, mix } from 'app/utils/bem';
import { HOME_PAGE } from 'app/routes';

import Link from 'app/modules/core/components/Link';
import Icon from 'app/modules/core/components/Icon';

const b = bem('Logotype');

function Logotype(props) {
    const {
        router,
        className,
        ...restProps
    } = props;

    const icon = (<Icon glyph="logotype" className={b('image')} />);
    let content = icon;

    if (!router.match(HOME_PAGE)) {
        content = (<Link href={appUrl(HOME_PAGE)} className={b('link')}>{icon}</Link>);
    }

    return (
        <div {...restProps} className={mix(b(), className)}>{content}</div>
    );
}

export default inject('router')(observer(Logotype));
