import React, { Component } from 'react';
import { observer } from 'mobx-react';

/*type Props = {
    router?: RouterStore,
    route: string,
    match: boolean,
    children?: Node,
    component?: ComponentType<any>
};*/

@observer
export default class Router extends Component {
    static defaultProps = {
        match: false
    };

    render() {
        const {
            match,
            children,
            component: Component
        } = this.props;

        if (match) {
            if (Component) {
                return (
                    <Component />
                );
            }

            if (children) {
                return children;
            }
        }

        return null;
    }
}
