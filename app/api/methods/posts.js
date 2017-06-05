import Api from 'framework/Api';

export default class PostsApi extends Api {
    name = 'posts';

    method = 'GET';

    async handler(context) {
        return await this.get('posts');
    }
}
