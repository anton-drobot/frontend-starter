// @flow

import noop from 'lodash/noop';

function push(url) {
    window.history.pushState({ url }, url, url);
}

function replace(url) {
    window.history.replaceState({ url }, url, url);
}

/**
 * Create HistoryAPI for browser or emulation for server.
 *
 * @param {Object} env - Dependency.
 *
 * @return {{push: push|noop, replace: replace|noop}}
 */
export function createHistory(env: Object): { push: (url: string) => void, replace: (url: string) => void } {
    if (env.isClientSide) {
        return {
            push,
            replace
        };
    }

    return {
        push: noop,
        replace: noop
    };
}
