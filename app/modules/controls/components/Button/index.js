import React from 'react';

import { bem, bemMix } from 'app/utils/bem';

const b = bem('Button');

export default function Button(props) {
    const {
        className,
        before,
        after,
        children,
        ...restProps
    } = props;

    return (
        <button {...restProps} className={bemMix(b(), className)}>
            {before && <span className={b('before')}>{before}</span>}
            {children && <span className={b('title')}>{children}</span>}
            {after && <span className={b('after')}>{after}</span>}
        </button>
    );
}

