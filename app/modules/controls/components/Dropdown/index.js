import React, { Component } from 'react';
import PropTypes from 'prop-types';

import bindAll from 'lodash/bindAll';
import { bem, bemMix } from 'app/utils/bem';

import Icon from 'app/modules/core/components/Icon';
import Popup from 'app/modules/controls/components/Popup';
import Button from 'app/modules/controls/components/Button';

const b = bem('Dropdown');

export default class Dropdown extends Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string.isRequired,
        before: PropTypes.string,
        opened: PropTypes.bool,
        children: PropTypes.any
    };

    state = {
        opened: this.props.opened || false
    };

    dom = {};

    constructor(props) {
        super(props);

        bindAll(this, ['onButtonClick', 'onClickOutside', 'refSelf']);
    }

    componentDidMount() {
        this.handleWindowEvents();
    }

    componentWillUnmount() {
        if (this.state.opened) {
            document.removeEventListener('click', this.onClickOutside);
        }
    }

    componentDidUpdate() {
        this.handleWindowEvents();
    }

    refSelf(element) {
        this.dom.self = element;
    }

    handleWindowEvents() {
        if (this.state.opened) {
            document.addEventListener('click', this.onClickOutside);
        } else {
            document.removeEventListener('click', this.onClickOutside);
        }
    }

    onButtonClick() {
        this.setState({ opened: !this.state.opened });
    }

    onClickOutside(e) {
        if (!this.dom.self.contains(e.target)) {
            this.setState({ opened: false });
        }
    }

    render() {
        const {
            className,
            title,
            before,
            children
        } = this.props;

        return (
            <div className={bemMix(b({ opened: this.state.opened }), className)} ref={this.refSelf}>
                <Button
                    className={b('button')}
                    type="button"
                    onClick={this.onButtonClick}
                    before={before}
                    after={<Icon glyph="caret" className={b('caret')} />}
                >
                    {title}
                </Button>
                <Popup
                    className={b('popup')}
                    visible={this.state.opened}
                >
                    {children}
                </Popup>
            </div>
        );
    }
};
