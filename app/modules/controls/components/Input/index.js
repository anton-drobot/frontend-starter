import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import { bem, mix } from 'app/libs/bem';

import UiStateStore from 'app/modules/controls/stores/UiState';

const b = bem('Input');

@inject('uiState')
@observer
export default class Input extends Component {
    static propTypes = {
        uiState: PropTypes.instanceOf(UiStateStore),
        className: PropTypes.string,
        type: PropTypes.oneOf([
            'hidden',
            'password',
            'text',
            'color',
            'date',
            'datetime',
            'datetime-local',
            'email',
            'number',
            'range',
            'search',
            'tel',
            'time',
            'url',
            'month',
            'week',
        ]),
        name: PropTypes.string,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.node,
        theme: PropTypes.string,
        size: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        inputRef: PropTypes.func
    };

    static defaultProps = {
        type: 'text',
        theme: 'default',
        size: 'm',
        disabled: false
    };

    constructor(props) {
        super(props);

        const {
            uiState,
            value
        } = props;

        this.id = uiState.uniqueId('input_');
        this.cursor = this.id;

        const storeValue = uiState.getValue(this.cursor);

        if (Object.prototype.toString.call(storeValue) === '[object Undefined]' && value) {
            uiState.setValue(this.cursor, value);
        }
    }

    onChange = (e) => {
        const {
            uiState,
            name,
            onChange
        } = this.props;

        const value = e.target.value;

        uiState.setValue(this.cursor, value);

        if (onChange) {
            onChange(e, { name, value });
        }
    };

    render() {
        const {
            uiState,
            className,
            type,
            name,
            placeholder,
            label,
            theme,
            size,
            disabled,
            inputRef,
            ...props
        } = this.props;

        delete props.value;
        delete props.onChange;

        const storeValue = uiState.getValue(this.cursor);

        return (
            <div className={mix(b({ withLabel: Boolean(label), size, theme, disabled }), className)}>
                {label && (
                    <div className={b('labelWrapper')}>
                        <label
                            className={b('label')}
                            htmlFor={this.id}
                        >
                            {label}
                        </label>
                    </div>
                )}

                <input
                    {...props}
                    ref={inputRef}
                    id={this.id}
                    className={b('input')}
                    type={type}
                    name={name}
                    value={storeValue}
                    placeholder={placeholder}
                    readOnly={disabled}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}
