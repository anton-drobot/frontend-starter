import noop from 'lodash/noop';
import { createHistory } from '../browserHistory';

describe('browserHistory', () => {
    describe('createHistory', () => {
        test('server side', () => {
            const env = {
                isClientSide: false
            };

            expect(createHistory(env)).toEqual({
                push: noop,
                replace: noop
            });
        });

        test('client side', () => {
            window.history.pushState = jest.fn();
            window.history.replaceState = jest.fn();

            const env = {
                isClientSide: true
            };

            const history = createHistory(env);

            expect(history).not.toEqual({
                push: noop,
                replace: noop
            });

            history.push('http://localhost:3000/test');
            expect(window.history.pushState).toHaveBeenCalledWith({ url: 'http://localhost:3000/test' }, 'http://localhost:3000/test', 'http://localhost:3000/test');

            history.replace('http://localhost:3000/test');
            expect(window.history.replaceState).toHaveBeenCalledWith({ url: 'http://localhost:3000/test' }, 'http://localhost:3000/test', 'http://localhost:3000/test');
        });
    });
});
