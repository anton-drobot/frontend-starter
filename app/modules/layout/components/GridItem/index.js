import React from 'react';
import { observer } from 'mobx-react';

import { bem, mix } from 'app/libs/bem';

const b = bem('GridItem');

const AVAILABLE_MODIFIERS = [
    'columns', 'offset',
    'columnsXS', 'offsetXS',
    'columnsS', 'offsetS',
    'columnsM', 'offsetM',
    'columnsL', 'offsetL',
    'columnsXL', 'offsetXL'
];

function GridItem(props) {
    const {
        className,
        children,
        ...restProps
    } = props;

    const modifiers = {};

    Object.keys(restProps).forEach((prop) => {
        if (AVAILABLE_MODIFIERS.includes(prop)) {
            modifiers[prop] = restProps[prop];
        }
    });

    return (
        <div className={mix(b(modifiers), className)}>{children}</div>
    );
}

export default observer(GridItem);
