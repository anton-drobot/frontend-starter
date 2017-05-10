import Env from 'framework/Env';
import noop from 'lodash/noop';

/**
 * Create HistoryAPI for browser or emulation for server.
 *
 * @return {{push: Function|noop, replace: Function|noop}}
 */
export function createHistory() {
    const history = {
        push: noop,
        replace: noop
    };

    if (Env.isClientSide) {
        history.push = (url) => {
            window.history.pushState({ url }, url, url);
        };

        history.replace = (url) => {
            window.history.replaceState({ url }, url, url);
        };
    }

    return history;
}
