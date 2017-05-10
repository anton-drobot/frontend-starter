import React, { Component } from 'react';
import PropTypes from 'prop-types';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import ChoiceButton from 'app/modules/controls/components/ChoiceButton';

const b = bem('RadioGroup');

export default class RadioGroup extends Component {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            disable: PropTypes.bool
        })).isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    state = {
        value: this.props.value || null
    };

    constructor(props) {
        super(props);

        bindAll(this, ['onChange']);
    }

    onChange(e, { value }) {
        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(e, value);
        }
    }

    render() {
        const {
            className,
            name,
            options
        } = this.props;

        return (
            <div className={bemMix(b(), className)}>
                {options.map((option) => (
                    <ChoiceButton
                        key={option.value}
                        type="radio"
                        name={name}
                        value={option.value}
                        title={option.title}
                        checked={option.value === this.state.value}
                        onChange={this.onChange}
                    />
                ))}
            </div>
        );
    }
}
