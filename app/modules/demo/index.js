import Module from 'framework/Module';
import PostsStore from 'app/modules/demo/stores/Posts';

export default class DemoModule extends Module {
    boot() {}

    registerStores() {
        return {
            posts: PostsStore
        };
    }
}
