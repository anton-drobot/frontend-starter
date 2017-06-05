import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
export default class Post extends Component {
    render() {
        const { post } = this.props;

        return (
            <article>
                <h3>{post.title}</h3>
                <section>
                    {post.body}
                </section>
            </article>
        );
    }
}
