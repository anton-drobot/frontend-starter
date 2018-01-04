// @flow

import noop from 'lodash/noop';

import inject from '../IoC/inject';
import { ENV_PROVIDER } from '../Providers/types';

/**
 * Create HistoryAPI for browser or emulation for server.
 *
 * @return {{push: Function|noop, replace: Function|noop}}
 */
export const createHistory = inject(ENV_PROVIDER)(function (env: Object): { push: (url: string) => void, replace: (url: string) => void } {
    const history = {
        push: noop,
        replace: noop
    };

    if (env.isClientSide) {
        history.push = (url) => {
            window.history.pushState({ url }, url, url);
        };

        history.replace = (url) => {
            window.history.replaceState({ url }, url, url);
        };
    }

    return history;
});
