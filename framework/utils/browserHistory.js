// @flow

import noop from 'lodash/noop';

import { ENV_PROVIDER } from 'framework/Providers/types';

/**
 * Create HistoryAPI for browser or emulation for server.
 *
 * @return {{push: Function|noop, replace: Function|noop}}
 */
export function createHistory(): { push: (url: string) => void, replace: (url: string) => void } {
    const Env = global.Container.make(ENV_PROVIDER);

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
