import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import bindAll from 'lodash/bindAll';

import { bem, mix } from 'app/utils/bem';

import RouterStore from 'app/modules/core/stores/Router';

const b = bem('Link');

@inject('router')
@observer
export default class Link extends Component {
    static propTypes = {
        router: PropTypes.instanceOf(RouterStore),
        className: PropTypes.string,
        theme: PropTypes.string,
        // TODO: href: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]).isRequired
        href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        target: PropTypes.string,
        rel: PropTypes.string,
        replace: PropTypes.bool,
        onClick: PropTypes.func,
        scrollTo: PropTypes.number
    };

    static defaultProps = {
        theme: 'default',
        replace: false,
        scrollTo: 0
    };

    constructor(...args) {
        super(...args);

        bindAll(this, ['onClick']);
    }

    onClick(e) {
        const {
            router,
            href,
            replace,
            onClick,
            scrollTo
        } = this.props;

        if (onClick) {
            onClick(e);
        }

        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            this.isModifiedEvent(e) ||
            !router.isApplicationUrl(href)
        ) {
            return;
        }

        e.preventDefault();

        router.go(href, { replace });
        window.scrollTo(scrollTo, 0);
    };

    isModifiedEvent(e) {
        return Boolean(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
    }

    render() {
        const {
            className,
            theme,
            href,
            children,
            target,
            rel,
            ...props
        } = this.props;

        delete props.router;
        delete props.replace;
        delete props.onClick;
        delete props.scrollTo;

        const relList = rel ? rel.split(' ') : [];

        if (target === '_blank') {
            relList.push('noreferrer');
            relList.push('noopener');
        }

        return (
            <a
                {...props}
                className={mix(b({ theme }), className)}
                href={href}
                target={target}
                rel={relList.join(' ') || null}
                onClick={target !== '_blank' ? this.onClick : null}
            >
                {children}
            </a>
        );
    }
}
