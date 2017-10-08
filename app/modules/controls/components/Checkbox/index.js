import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import { bem, mix } from 'app/utils/bem';

import UiStateStore from 'app/modules/controls/stores/UiState';

import Icon from 'app/modules/core/components/Icon';

const b = bem('Checkbox');

@inject('uiState')
@observer
export default class Checkbox extends Component {
    static propTypes = {
        uiState: PropTypes.instanceOf(UiStateStore),
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        defaultChecked: PropTypes.bool,
        theme: PropTypes.string,
        size: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        inputRef: PropTypes.func
    };

    static defaultProps = {
        defaultChecked: false,
        theme: 'default',
        size: 'm',
        disabled: false
    };

    constructor(props) {
        super(props);

        const {
            uiState,
            defaultChecked
        } = props;

        this.id = uiState.uniqueId('checkbox_');
        this.cursor = this.id;

        const checked = uiState.getValue(this.cursor);

        if (Object.prototype.toString.call(checked) === '[object Undefined]') {
            uiState.setValue(this.cursor, defaultChecked);
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

        uiState.setValue(this.cursor, checked);

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

        delete props.defaultChecked;
        delete props.onChange;

        const checked = uiState.getValue(this.cursor);

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
                    type="checkbox"
                    name={name}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                    onChange={this.onChange}
                />

                <span className={b('indicator')}>
                    {checked && (
                        <Icon
                            className={b('icon')}
                            glyph="tick"
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
