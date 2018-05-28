import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import { bem, mix } from 'app/libs/bem';

import UiStateStore from 'app/modules/controls/stores/UiState';

import Icon from 'app/modules/core/components/Icon';

const b = bem('Radio');

@inject('uiState')
@observer
export default class Radio extends Component {
    static propTypes = {
        uiState: PropTypes.instanceOf(UiStateStore),
        className: PropTypes.string,
        formId: PropTypes.string, // for unique cursor value
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        defaultChecked: PropTypes.bool,
        theme: PropTypes.string,
        size: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        inputRef: PropTypes.func
    };

    static defaultProps = {
        formId: 'common',
        defaultChecked: false,
        theme: 'default',
        size: 'm',
        disabled: false
    };

    constructor(props) {
        super(props);

        const {
            uiState,
            formId,
            name,
            value,
            defaultChecked
        } = props;

        this.id = uiState.uniqueId('radio_');
        this.cursor = `${formId}_${name}`;

        const storeValue = uiState.getValue(this.cursor);

        if (Object.prototype.toString.call(storeValue) === '[object Undefined]' && defaultChecked) {
            uiState.setValue(this.cursor, value);
        }
    }

    onChange = (e) => {
        const {
            uiState,
            name,
            value,
            onChange
        } = this.props;

        const checked = e.target.checked;

        if (checked) {
            uiState.setValue(this.cursor, value);
        }

        if (onChange) {
            onChange(e, { name, value, checked });
        }
    };

    render() {
        const {
            uiState,
            className,
            name,
            value,
            theme,
            size,
            disabled,
            children,
            inputRef,
            ...props
        } = this.props;

        delete props.formId;
        delete props.defaultChecked;
        delete props.onChange;

        const storeValue = uiState.getValue(this.cursor);

        return (
            <label
                className={mix(b({ size, theme, disabled }), className)}
                htmlFor={this.id}
            >
                <input
                    {...props}
                    ref={inputRef}
                    id={this.id}
                    className={b('input')}
                    type="radio"
                    name={name}
                    value={value}
                    checked={value === storeValue}
                    disabled={disabled}
                    onChange={this.onChange}
                />

                <span className={b('indicator')}>
                    {value === storeValue && (
                        <Icon
                            className={b('icon')}
                            glyph="circle"
                        />
                    )}
                </span>

                {children && (
                    <span className={b('label')}>{children}</span>
                )}
            </label>
        );
    }
}
