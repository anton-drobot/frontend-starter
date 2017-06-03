import React from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/utils/bem';

const b = bem('GridItem');

const AVAILABLE_MODIFIERS = [
    'columns', 'offset',
    'columnsXS', 'offsetXS',
    'columnsS', 'offsetS',
    'columnsM', 'offsetM',
    'columnsL', 'offsetL',
    'columnsXL', 'offsetXL'
];

export default (observer(function GridItem(props) {
    const {
        children,
        ...restProps
    } = props;

    const modifiers = {};

    Object.keys(restProps).forEach((prop) => {
        if (AVAILABLE_MODIFIERS.includes(prop)) {
            modifiers[`${prop}-${restProps[prop]}`] = true;
        }
    });

    return (
        <div className={b(modifiers)}>{children}</div>
    );
}));
