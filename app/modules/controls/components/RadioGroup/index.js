import React, { Component } from 'react';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import ChoiceButton from 'app/modules/controls/components/ChoiceButton';

const b = bem('RadioGroup');

export default class RadioGroup extends Component {
    static propTypes = {
        className: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            value: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            disable: React.PropTypes.bool
        })).isRequired,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
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
