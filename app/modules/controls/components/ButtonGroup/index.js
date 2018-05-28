import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { bem, mix } from 'app/libs/bem';

const b = bem('ButtonGroup');

function ButtonGroup(props) {
    const {
        className,
        children
    } = props;

    return (
        <div className={mix(b(), className)}>
            {children}
        </div>
    );
}

ButtonGroup.propTypes = {
    className: PropTypes.string
};

export default observer(ButtonGroup);
