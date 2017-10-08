import { CONFIG_PROVIDER } from '../../Providers/types';
import Config from '../../Services/Config';
import { parse, isAbsoluteUrl, isAppUrl, normalizePath } from '../../utils/url';

describe('url', () => {
    test('parse', () => {
        const url1 = parse('foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');

        expect(url1.protocol).toBe('foo:');
        expect(url1.slashes).toBe(true);
        expect(url1.auth).toBe('username:password');
        expect(url1.username).toBe('username');
        expect(url1.password).toBe('password');
        expect(url1.host).toBe('www.example.com:123');
        expect(url1.hostname).toBe('www.example.com');
        expect(url1.port).toBe('123');
        expect(url1.pathname).toBe('/hello/world/there.html');
        expect(url1.query).toEqual({ name: 'ferret' });
        expect(url1.hash).toBe('#foo');
        expect(url1.href).toBe('foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');
        expect(url1.origin).toBe('foo://www.example.com:123');

        const url2 = parse('http://example.com/whatever/?qs=32');

        expect(url2.protocol).toBe('http:');
        expect(url2.slashes).toBe(true);
        expect(url2.auth).toBe('');
        expect(url2.username).toBe('');
        expect(url2.password).toBe('');
        expect(url2.host).toBe('example.com');
        expect(url2.hostname).toBe('example.com');
        expect(url2.port).toBe('');
        expect(url2.pathname).toBe('/whatever/');
        expect(url2.query).toEqual({ qs: '32' });
        expect(url2.hash).toBe('');
        expect(url2.href).toBe('http://example.com/whatever/?qs=32');
        expect(url2.origin).toBe('http://example.com');

        const url3 = parse('/foo/bar/?foo=bar');

        // Some validations didn't work correct because "parse-url" take global.location as default.
        // global.location.protocol equals "about:" in this environment
        //expect(url3.protocol).toBe('');
        expect(url3.slashes).toBe(false);
        expect(url3.auth).toBe('');
        expect(url3.username).toBe('');
        expect(url3.password).toBe('');
        expect(url3.host).toBe('');
        expect(url3.hostname).toBe('');
        expect(url3.port).toBe('');
        expect(url3.pathname).toBe('/foo/bar/');
        expect(url3.query).toEqual({ foo: 'bar' });
        expect(url3.hash).toBe('');
        //expect(url3.href).toBe('/foo/bar/?foo=bar');
        //expect(url3.origin).toBe('');
    });

    test('isAbsoluteUrl', () => {
        const SERVICES = {
            [CONFIG_PROVIDER]: () => {
                const cfg = new Config();
                cfg.register('app', { baseUrl: 'http://localhost:3000' });

                return cfg;
            }
        };

        global.Container = {
            make: (type) => SERVICES[type]()
        };

        expect(isAbsoluteUrl('http://google.com/')).toBe(true);
        expect(isAbsoluteUrl('https://google.com/')).toBe(true);
        expect(isAbsoluteUrl('//google.com/')).toBe(true);
        expect(isAbsoluteUrl('ftp://google.com/')).toBe(true);
        expect(isAbsoluteUrl('http://google.com/foo/bar')).toBe(true);

        expect(isAbsoluteUrl('foo/bar')).toBe(false);
        expect(isAbsoluteUrl('/foo/bar')).toBe(false);
        expect(isAbsoluteUrl('/foo/bar?foo=bar')).toBe(false);
        expect(isAbsoluteUrl('/foo/bar?foo=bar#foo')).toBe(false);
    });

    test('isAppUrl', () => {
        expect(isAppUrl('http://localhost:3000')).toBe(true);
        expect(isAppUrl('http://localhost:3000/foo/bar')).toBe(true);

        expect(isAppUrl('http://google.com/')).toBe(false);
        expect(isAppUrl('http://google.com/foo/bar')).toBe(false);
        expect(isAppUrl('/foo/bar')).toBe(false);
    });

    test('normalizePath', () => {
        let SERVICES = {};

        global.Container = {
            make: (type) => SERVICES[type]()
        };

        SERVICES = {
            [CONFIG_PROVIDER]: () => {
                const cfg = new Config();
                cfg.register('app', { trailingSlash: null });

                return cfg;
            }
        };

        expect(normalizePath('path')).toBe('/path');
        expect(normalizePath('/path')).toBe('/path');

        SERVICES = {
            [CONFIG_PROVIDER]: () => {
                const cfg = new Config();
                cfg.register('app', { trailingSlash: true });

                return cfg;
            }
        };

        expect(normalizePath('/path')).toBe('/path/');
        expect(normalizePath('/path/')).toBe('/path/');

        SERVICES = {
            [CONFIG_PROVIDER]: () => {
                const cfg = new Config();
                cfg.register('app', { trailingSlash: false });

                return cfg;
            }
        };

        expect(normalizePath('/path')).toBe('/path');
        expect(normalizePath('/path/')).toBe('/path');
    });
});
