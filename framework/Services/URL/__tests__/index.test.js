import URL from '../index';
import Config from '../../Config';

describe('URL', () => {
    test('parse', () => {
        const config = new Config();

        const url1 = new URL(config, 'foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');

        expect(url1.protocol).toBe('foo:');
        expect(url1.username).toBe('username');
        expect(url1.password).toBe('password');
        expect(url1.host).toBe('www.example.com:123');
        expect(url1.hostname).toBe('www.example.com');
        expect(url1.port).toBe(123);
        expect(url1.pathname).toBe('/hello/world/there.html');
        expect(url1.search).toEqual('?name=ferret');
        expect(url1.query).toEqual({ name: 'ferret' });
        expect(url1.hash).toBe('#foo');
        expect(url1.href).toBe('foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');
        expect(url1.origin).toBe('foo://www.example.com:123');

        const url2 = new URL(config, 'http://example.com/whatever/?qs=32');

        expect(url2.protocol).toBe('http:');
        expect(url2.username).toBe('');
        expect(url2.password).toBe('');
        expect(url2.host).toBe('example.com');
        expect(url2.hostname).toBe('example.com');
        expect(url2.port).toBe(null);
        expect(url2.pathname).toBe('/whatever/');
        expect(url2.search).toEqual('?qs=32');
        expect(url2.query).toEqual({ qs: '32' });
        expect(url2.hash).toBe('');
        expect(url2.href).toBe('http://example.com/whatever/?qs=32');
        expect(url2.origin).toBe('http://example.com');

        const url3 = new URL(config, '/foo/bar/?foo=bar');

        expect(url3.protocol).toBe('');
        expect(url3.username).toBe('');
        expect(url3.password).toBe('');
        expect(url3.host).toBe('');
        expect(url3.hostname).toBe('');
        expect(url3.port).toBe(null);
        expect(url3.pathname).toBe('/foo/bar/');
        expect(url3.search).toEqual('?foo=bar');
        expect(url3.query).toEqual({ foo: 'bar' });
        expect(url3.hash).toBe('');
        expect(url3.href).toBe('/foo/bar/?foo=bar');
        expect(url3.origin).toBe('');

        const url4 = new URL(config);

        expect(url4.protocol).toBe('');
        expect(url4.username).toBe('');
        expect(url4.password).toBe('');
        expect(url4.host).toBe('');
        expect(url4.hostname).toBe('');
        expect(url4.port).toBe(null);
        expect(url4.pathname).toBe('');
        expect(url4.search).toEqual('');
        expect(url4.query).toEqual({});
        expect(url4.hash).toBe('');
        expect(url4.href).toBe('');
        expect(url4.origin).toBe('');
    });
    
    test('make', () => {
        const config = new Config();

        expect(new URL(config).make('http://example.com/').href).toBe('http://example.com');
        expect(new URL(config).make('http://example.com/foo/:bar', { bar: 'baz' }).href).toBe('http://example.com/foo/baz');
    });

    test('makeApp', () => {
        const config1 = new Config();
        config1.register('files', {
            availableExtensions: { default: ['txt'] }
        });

        expect(new URL(config1).makeApp('/').href).toBe('/');
        expect(new URL(config1).makeApp('/foo').href).toBe('/foo');
        expect(new URL(config1).makeApp('/foo.txt').href).toBe('/foo.txt');
        expect(new URL(config1).makeApp('/foo/:bar', { bar: 'baz' }).href).toBe('/foo/baz');

        const config2 = new Config();
        config2.register('app', {
            baseUrl: 'http://appurl.com/'
        });
        config2.register('files', {
            availableExtensions: { default: ['txt'] }
        });

        expect(new URL(config2).makeApp('/').href).toBe('http://appurl.com/');
        expect(new URL(config2).makeApp('/foo').href).toBe('http://appurl.com/foo');
        expect(new URL(config2).makeApp('/foo.txt').href).toBe('http://appurl.com/foo.txt');
        expect(new URL(config2).makeApp('/foo/:bar', { bar: 'baz' }).href).toBe('http://appurl.com/foo/baz');

        const config3 = new Config();
        config3.register('app', {
            baseUrl: 'http://appurl.com/',
            trailingSlash: true
        });
        config3.register('files', {
            availableExtensions: { default: ['txt'] }
        });

        expect(new URL(config3).makeApp('/').href).toBe('http://appurl.com/');
        expect(new URL(config3).makeApp('/foo').href).toBe('http://appurl.com/foo/');
        expect(new URL(config3).makeApp('/foo.txt').href).toBe('http://appurl.com/foo.txt');
        expect(new URL(config3).makeApp('/foo/').href).toBe('http://appurl.com/foo/');
        expect(new URL(config3).makeApp('/foo/:bar', { bar: 'baz' }).href).toBe('http://appurl.com/foo/baz/');
        expect(new URL(config3).makeApp('/foo/:bar/', { bar: 'baz' }).href).toBe('http://appurl.com/foo/baz/');

        const config4 = new Config();
        config4.register('app', {
            baseUrl: 'http://appurl.com/',
            trailingSlash: false
        });
        config4.register('files', {
            availableExtensions: { default: ['txt'] }
        });

        expect(new URL(config4).makeApp('/').href).toBe('http://appurl.com');
        expect(new URL(config4).makeApp('/foo').href).toBe('http://appurl.com/foo');
        expect(new URL(config4).makeApp('/foo.txt').href).toBe('http://appurl.com/foo.txt');
        expect(new URL(config4).makeApp('/foo/').href).toBe('http://appurl.com/foo');
        expect(new URL(config4).makeApp('/foo/:bar', { bar: 'baz' }).href).toBe('http://appurl.com/foo/baz');
        expect(new URL(config4).makeApp('/foo/:bar/', { bar: 'baz' }).href).toBe('http://appurl.com/foo/baz');
    });
    
    test('isAbsolute', () => {
        const config = new Config();
        
        expect(new URL(config, 'http://google.com/').isAbsolute()).toBe(true);
        expect(new URL(config, 'https://google.com/').isAbsolute()).toBe(true);
        expect(new URL(config, '//google.com/').isAbsolute()).toBe(true);
        expect(new URL(config, 'ftp://google.com/').isAbsolute()).toBe(true);
        expect(new URL(config, 'http://google.com/foo/bar').isAbsolute()).toBe(true);

        expect(new URL(config, 'foo/bar').isAbsolute()).toBe(false);
        expect(new URL(config, '/foo/bar').isAbsolute()).toBe(false);
        expect(new URL(config, '/foo/bar?foo=bar').isAbsolute()).toBe(false);
        expect(new URL(config, '/foo/bar?foo=bar#foo').isAbsolute()).toBe(false);
    });

    test('isAppUrl', () => {
        const config = new Config();
        config.register('app', {
            baseUrl: 'http://appurl.com/'
        });

        expect(new URL(config, 'http://appurl.com').isAppUrl()).toBe(true);
        expect(new URL(config, 'http://appurl.com/').isAppUrl()).toBe(true);
        expect(new URL(config, 'http://appurl.com/foo/bar').isAppUrl()).toBe(true);

        expect(new URL(config, 'http://google.com/').isAppUrl()).toBe(false);
        expect(new URL(config, 'http://google.com/foo/bar').isAppUrl()).toBe(false);
        expect(new URL(config, '/foo/bar').isAppUrl()).toBe(false);
    });

    test('getExtension', () => {
        const config = new Config();

        expect(new URL(config, 'http://google.com').getExtension()).toBe(null);
        expect(new URL(config, '/foo/bar').getExtension()).toBe(null);
        expect(new URL(config, '/foo/bar?query=foo').getExtension()).toBe(null);
        expect(new URL(config, '/foo/bar?query=foo#hash').getExtension()).toBe(null);
        expect(new URL(config, 'http://example.com/').getExtension()).toBe(null);
        expect(new URL(config, 'http://example.com/foo/bar').getExtension()).toBe(null);
        expect(new URL(config, 'http://example.com/foo/bar?query=foo').getExtension()).toBe(null);
        expect(new URL(config, 'http://example.com/foo/bar?query=foo#hash').getExtension()).toBe(null);

        expect(new URL(config, '/foo/bar.baz').getExtension()).toBe('baz');
        expect(new URL(config, '/foo/bar.baz?query=foo').getExtension()).toBe('baz');
        expect(new URL(config, '/foo/bar.baz?query=foo#hash').getExtension()).toBe('baz');
        expect(new URL(config, 'http://example.com/foo/bar.baz').getExtension()).toBe('baz');
        expect(new URL(config, 'http://example.com/foo/bar.baz?query=foo').getExtension()).toBe('baz');
        expect(new URL(config, 'http://example.com/foo/bar.baz?query=foo#hash').getExtension()).toBe('baz');
    });

    test('isAvailableFile', () => {
        const config = new Config();
        config.register('files', {
            availableExtensions: {
                default: ['txt'],
                images: ['jpg']
            }
        });

        expect(new URL(config, 'http://example.com/foo/document.txt').isAvailableFile()).toBe(true);
        expect(new URL(config, 'http://example.com/foo/document.jpg').isAvailableFile()).toBe(true);

        expect(new URL(config, 'http://example.com/').isAvailableFile()).toBe(false);
        expect(new URL(config, 'http://example.com/foo/document').isAvailableFile()).toBe(false);
        expect(new URL(config, 'http://example.com/foo/document.gif').isAvailableFile()).toBe(false);
    });
});
