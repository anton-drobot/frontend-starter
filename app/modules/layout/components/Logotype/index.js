import React from 'react';
import { observer, inject } from 'mobx-react';

import { bem, bemMix } from 'app/utils/bem';
import { appUrl } from 'framework/utils/url';

import ROUTES from 'app/routes';

import Link from 'app/modules/core/components/Link';
import Icon from 'app/modules/core/components/Icon';

const b = bem('Logotype');

export default inject('router')(observer(function Logotype(props) {
    const {
        router,
        className,
        ...restProps
    } = props;

    const icon = (<Icon glyph="logotype" className={b('image')} />);
    let content = icon;

    if (router.location.path !== ROUTES.HOME.route) {
        content = (<Link to={appUrl(ROUTES.HOME.route)} className={b('link')}>{icon}</Link>);
    }

    return (
        <div {...restProps} className={bemMix(b(), className)}>{content}</div>
    );
}));
