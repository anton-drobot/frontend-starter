import React, { Component } from 'react';

import { bem, bemMix } from 'app/utils/bem';

const b = bem('Popup');

const POSITIONS = [
    ['bottom', 'left']
];

export default class Popup extends Component {
    render() {
        const {
            className,
            visible,
            children
        } = this.props;

        return (
            <div className={bemMix(b({ visible, position: 'bottom-left' }), className)}>
                {children}
            </div>
        );
    }
}

