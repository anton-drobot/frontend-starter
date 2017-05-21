import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Lang from 'framework/Lang';

@observer
export default class NotFound extends Component {
    render() {
        return (
            <div>{Lang.get('demo.notFound')}</div>
        );
    }
}
