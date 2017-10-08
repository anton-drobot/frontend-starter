import Config from '../../Services/Config';

describe('Config', () => {
    test('register', () => {
        const config = new Config();
        config.register('app', { foo: 'bar' });

        expect(config.getAll()).toEqual({
            app: {
                foo: 'bar'
            }
        });
    });

    test('get', () => {
        const config = new Config();
        config.register('app', { foo: 'bar' });

        expect(config.get('app.foo')).toBe('bar');
        expect(config.get('app.baz')).toBe(undefined);
        expect(config.get('app.baz', 'default')).toBe('default');
    });

    test('set', () => {
        const config = new Config();
        config.register('app', { foo: 'bar' });
        config.set('app.foo', 123);
        config.set('app.baz', 'abcd');

        expect(config.get('app.foo')).toBe(123);
        expect(config.get('app.baz')).toBe('abcd');
    });
});
