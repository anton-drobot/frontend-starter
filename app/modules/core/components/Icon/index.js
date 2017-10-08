import React from 'react';
import { observer } from 'mobx-react';
import { bem, mix } from 'app/utils/bem';
import { appUrl } from 'framework/utils/url';

const b = bem('Icon');

function Icon(props) {
    const {
        className,
        glyph,
        ...restProps
    } = props;

    return (
        <svg {...restProps} className={mix(b({ [glyph]: true }), className)}>
            <use xlinkHref={appUrl(`/assets/images/sprite.svg#icon-${glyph}`)} />
        </svg>
    );
}

export default observer(Icon);
