import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import bindAll from 'lodash/bindAll'
import { bem, bemMix } from 'app/utils/bem';

const b = bem('Link');

const isModifiedEvent = (e) => Boolean(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

@inject('router')
@observer
export default class Link extends Component {
    constructor(props) {
        super(props);

        bindAll(this, ['onClick']);
    }

    onClick(e) {
        const {
            router,
            to,
            replace = false,
            onClick
        } = this.props;

        if (onClick) {
            onClick(e);
        }

        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            isModifiedEvent(e) ||
            !router.isRegisteredRoute(to)
        ) {
            return;
        }

        if (router.location.url === to) {
            e.preventDefault();

            return;
        }

        e.preventDefault();
        router.setLocation(to, replace);
    }

    render() {
        const {
            router,
            className,
            to,
            children,
            target,
            rel,
            replace,
            onClick,
            ...props
        } = this.props;

        const relList = rel ? rel.split(' ') : [];

        if (target === '_blank') {
            relList.push('noreferrer');
            relList.push('noopener');
        }

        /**
         * todo: не работает ссылка, если есть target.
         * Кажется, где-то в коде реакта есть return у event, поэтому браузер не знает, что делать с такой ссылкой.
         */
        return (
            <a
                {...props}
                className={bemMix(b(), className)}
                href={to}
                target={target}
                rel={relList.join(' ') || null}
                onClick={target !== '_blank' && this.onClick}
            >
                {children}
            </a>
        );
    }
}
