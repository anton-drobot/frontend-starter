import React from 'react';
import { observer } from 'mobx-react';
import { bem, bemMix } from 'app/utils/bem';
import { appUrl } from 'framework/utils/url';

const b = bem('Icon');

export default observer(function Icon(props) {
    const {
        className,
        glyph,
        ...restProps
    } = props;

    return (
        <svg {...restProps} className={bemMix(b({ [glyph]: true }), className)}>
            <use xlinkHref={appUrl(`/assets/images/sprite.svg#icon-${glyph}`)} />
        </svg>
    );
});
