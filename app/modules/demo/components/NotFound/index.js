import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('router')
@observer
export default class NotFound extends Component {
    render() {
        return (
            <div>Not Found</div>
        );
    }
}
