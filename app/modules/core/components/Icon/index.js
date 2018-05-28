import React from 'react';
import { observer } from 'mobx-react';

import { URL_PROVIDER } from 'framework/Providers/types';
import { bem, mix } from 'app/libs/bem';

const URL = global.Container.make(URL_PROVIDER);
const b = bem('Icon');

function Icon(props) {
    const {
        className,
        glyph,
        ...restProps
    } = props;

    const link = (new URL).makeApp(`/assets/images/sprite.svg#icon-${glyph}`);

    return (
        <svg {...restProps} className={mix(b({ [glyph]: true }), className)}>
            <use xlinkHref={link} />
        </svg>
    );
}

export default observer(Icon);
