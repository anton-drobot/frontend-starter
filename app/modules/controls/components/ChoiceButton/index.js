import React, { Component } from 'react';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import Button from '../Button/index';

const b = bem('ChoiceButton');

export default class ChoiceButton extends Component {
    constructor(props) {
        super(props);

        bindAll(this, ['onClick']);
    }

    onClick(e) {
        if (this.props.onChange) {
            this.props.onChange(e, { value: this.props.value, checked: !this.props.checked });
        }
    }

    render() {
        const {
            className,
            type,
            name,
            value,
            title,
            checked
        } = this.props;

        return (
            <div className={bemMix(b({ checked }), className)}>
                <Button
                    className={b('button')}
                    onClick={this.onClick}
                    type="button"
                >
                    {title}
                </Button>
                <input
                    className={b('input')}
                    type={type}
                    name={name}
                    value={value}
                    checked={checked}
                />
            </div>
        );
    }
}
