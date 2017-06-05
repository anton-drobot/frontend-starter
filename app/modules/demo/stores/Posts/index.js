import { observable, action } from 'mobx';

import Store from 'framework/Store';

export default class PostsStore extends Store {
    @observable posts = [];

    @action
    setPosts(posts) {
        this.posts = posts;
    }

    async getPosts() {
        this.setPosts(await this.get('posts'));
    }
}
