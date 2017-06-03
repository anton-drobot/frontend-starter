import React from 'react';
import { observer } from 'mobx-react';

import { bem, bemMix } from 'app/utils/bem';

const b = bem('Grid');

export default (observer(function Grid(props) {
    const {
        className,
        children
    } = props;

    return (
        <div className={bemMix(b(), className)}>{children}</div>
    );
}));
