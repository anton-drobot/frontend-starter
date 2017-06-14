import ApiMethod from 'framework/ApiMethod';

export default class PostsApi extends ApiMethod {
    name = 'posts';

    method = 'GET';

    async handler(context) {
        return await this.apiGet('posts');
    }
}
