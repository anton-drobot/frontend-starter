// @flow

import noop from 'lodash/noop';

import inject from '../IoC/inject';
import { ENV_PROVIDER } from '../Providers/types';

function push(url) {
    window.history.pushState({ url }, url, url);
}

function replace(url) {
    window.history.replaceState({ url }, url, url);
}

/**
 * Create HistoryAPI for browser or emulation for server.
 *
 * @return {{push: push|noop, replace: replace|noop}}
 */
export const createHistory = inject(ENV_PROVIDER)(function (env: Object): { push: (url: string) => void, replace: (url: string) => void } {
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
});
