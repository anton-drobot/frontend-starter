import React, { Component } from 'react';
import PropTypes from 'prop-types';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import Dropdown from 'app/modules/controls/components/Dropdown';

const b = bem('Select');

// TODO: сделать disabled поля

export default class Select extends Component {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            disable: PropTypes.bool
        })).isRequired,
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func
    };

    state = {
        value: this.getInitialValue()
    };

    constructor(props) {
        super(props);

        bindAll(this, ['onItemClick']);
    }

    getInitialValue() {
        if (this.props.value) {
            return this.props.value;
        }

        return this.getDefaultValue();
    }

    getDefaultValue() {
        if (this.props.defaultValue) {
            return this.props.defaultValue;
        }

        return this.props.options[0].value;
    }

    onItemClick(e) {
        const value = e.currentTarget.getAttribute('data-value');

        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(e, value);
        }
    }

    render() {
        const {
            className,
            label,
            name,
            options
        } = this.props;

        const selected = options.find((option) => (option.value === this.state.value));

        return (
            <div className={bemMix(b(), className)}>
                <Dropdown
                    before={label}
                    title={selected.title}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={b('item', { selected: option.value === selected.value })}
                            data-value={option.value}
                            onClick={this.onItemClick}
                        >
                            {option.title}
                        </div>
                    ))}
                </Dropdown>
                <select
                    className={b('select')}
                    name={name}
                    value={selected.value}
                    readOnly
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.title}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}
