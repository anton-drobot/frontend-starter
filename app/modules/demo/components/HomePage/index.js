import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Lang from 'framework/Lang';

import { bem } from 'app/utils/bem';

import Grid from 'app/modules/layout/components/Grid';
import GridItem from 'app/modules/layout/components/GridItem';
import Post from 'app/modules/demo/components/Post';

const b = bem('HomePage');

@inject('posts')
@observer
export default class HomePage extends Component {
    static async onRequest(stores) {
        stores.posts.setPosts(await stores.posts.getPosts());
    }

    render() {
        const { posts } = this.props;

        return (
            <div className={b()}>
                <Grid>
                    {posts.posts.length ?
                        posts.posts.map((post) => (
                            <GridItem key={post.id} columns={4}>
                                <Post post={post} />
                            </GridItem>
                        )) :
                        (
                            <GridItem columns={12}>
                                {Lang.get('demo.loading')}
                            </GridItem>
                        )
                    }
                </Grid>
                <Grid>
                    <GridItem columns={3} columnsL={8}>
                        {Lang.get('demo.homePage', { name: 'Username' })}
                    </GridItem>
                    <GridItem columns={4} offset={1} columnsL={4} offsetL={0}>
                        {Lang.get('demo.homePage', { name: 'Username 2' })}
                    </GridItem>
                    <GridItem columns={4} columnsL={12} offsetL={2} offsetM={0}>
                        {Lang.get('demo.homePage', { name: 'Username 3' })}
                    </GridItem>
                </Grid>
            </div>
        );
    }
}
