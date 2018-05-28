import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { bem, mix } from 'app/libs/bem';

const b = bem('Button');

function Button(props) {
    const {
        className,
        before,
        after,
        children,
        type,
        theme,
        size,
        disabled,
        ...restProps
    } = props;

    return (
        <button
            {...restProps}
            className={mix(b({ before: Boolean(before), after: Boolean(after), size, theme }), className)}
            type={type}
            disabled={disabled}
        >
            {before && <span className={b('before')}>{before}</span>}
            {children && <span className={b('content')}>{children}</span>}
            {after && <span className={b('after')}>{after}</span>}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    before: PropTypes.node,
    after: PropTypes.node,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    theme: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool
};

Button.defaultProps = {
    type: 'button',
    theme: 'default',
    size: 'm',
    disabled: false
};

export default observer(Button);
