import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('router')
@observer
export default class Router extends Component {
    render() {
        const {
            router,
            children
        } = this.props;

        let child;

        React.Children.forEach(children, (element) => {
            if (!React.isValidElement(element)) {
                return;
            }

            const { route, httpStatus } = element.props;

            if (!child && (router.httpStatus === httpStatus || router.match(route))) {
                child = element;
            }
        });

        return child ? React.cloneElement(child, { match: true }) : null;
    }
}
