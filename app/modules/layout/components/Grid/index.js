import React from 'react';
import { observer } from 'mobx-react';

import { bem, mix } from 'app/utils/bem';

const b = bem('Grid');

function Grid(props) {
    const {
        className,
        children
    } = props;

    return (
        <div className={mix(b(), className)}>{children}</div>
    );
}

export default observer(Grid);
