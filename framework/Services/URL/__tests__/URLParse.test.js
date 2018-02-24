import URLParse from '../URLParse';

describe('URLParse', () => {
    test('parse', () => {
        const location1 = new URLParse('foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');

        expect(location1.protocol).toBe('foo:');
        expect(location1.username).toBe('username');
        expect(location1.password).toBe('password');
        expect(location1.host).toBe('www.example.com:123');
        expect(location1.hostname).toBe('www.example.com');
        expect(location1.port).toBe(123);
        expect(location1.pathname).toBe('/hello/world/there.html');
        expect(location1.search).toBe('?name=ferret');
        expect(location1.query).toEqual({ name: 'ferret' });
        expect(location1.hash).toBe('#foo');
        expect(location1.href).toBe('foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');
        expect(location1.origin).toBe('foo://www.example.com:123');

        const location2 = new URLParse('http://example.com/whatever/?qs=32');

        expect(location2.protocol).toBe('http:');
        expect(location2.username).toBe('');
        expect(location2.password).toBe('');
        expect(location2.host).toBe('example.com');
        expect(location2.hostname).toBe('example.com');
        expect(location2.port).toBe(null);
        expect(location2.pathname).toBe('/whatever/');
        expect(location2.search).toBe('?qs=32');
        expect(location2.query).toEqual({ qs: '32' });
        expect(location2.hash).toBe('');
        expect(location2.href).toBe('http://example.com/whatever/?qs=32');
        expect(location2.origin).toBe('http://example.com');

        const location3 = new URLParse('/foo/bar/?foo=bar');

        expect(location3.protocol).toBe('');
        expect(location3.username).toBe('');
        expect(location3.password).toBe('');
        expect(location3.host).toBe('');
        expect(location3.hostname).toBe('');
        expect(location3.port).toBe(null);
        expect(location3.pathname).toBe('/foo/bar/');
        expect(location3.search).toBe('?foo=bar');
        expect(location3.query).toEqual({ foo: 'bar' });
        expect(location3.hash).toBe('');
        expect(location3.href).toBe('/foo/bar/?foo=bar');
        expect(location3.origin).toBe('');

        const location4 = new URLParse('//username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');

        expect(location4.protocol).toBe('');
        expect(location4.username).toBe('username');
        expect(location4.password).toBe('password');
        expect(location4.host).toBe('www.example.com:123');
        expect(location4.hostname).toBe('www.example.com');
        expect(location4.port).toBe(123);
        expect(location4.pathname).toBe('/hello/world/there.html');
        expect(location4.search).toBe('?name=ferret');
        expect(location4.query).toEqual({ name: 'ferret' });
        expect(location4.hash).toBe('#foo');
        expect(location4.href).toBe('//username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');
        expect(location4.origin).toBe('//www.example.com:123');

        const location5 = new URLParse('mailto:test@example.com');

        expect(location5.protocol).toBe('mailto:');
        expect(location5.username).toBe('');
        expect(location5.password).toBe('');
        expect(location5.host).toBe('');
        expect(location5.hostname).toBe('');
        expect(location5.port).toBe(null);
        expect(location5.pathname).toBe('test@example.com');
        expect(location5.search).toBe('');
        expect(location5.query).toEqual({});
        expect(location5.hash).toBe('');
        expect(location5.href).toBe('mailto:test@example.com');
        expect(location5.origin).toBe('');

        const location6 = new URLParse('http://username@example.com');

        expect(location6.protocol).toBe('http:');
        expect(location6.username).toBe('username');
        expect(location6.password).toBe('');
        expect(location6.host).toBe('example.com');
        expect(location6.hostname).toBe('example.com');
        expect(location6.port).toBe(null);
        expect(location6.pathname).toBe('');
        expect(location6.search).toBe('');
        expect(location6.query).toEqual({});
        expect(location6.hash).toBe('');
        expect(location6.href).toBe('http://username@example.com');
        expect(location6.origin).toBe('http://example.com');

        const location7 = new URLParse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');

        expect(location7.protocol).toBe('data:');
        expect(location7.username).toBe('');
        expect(location7.password).toBe('');
        expect(location7.host).toBe('');
        expect(location7.hostname).toBe('');
        expect(location7.port).toBe(null);
        expect(location7.pathname).toBe('text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect(location7.search).toBe('');
        expect(location7.query).toEqual({});
        expect(location7.hash).toBe('');
        expect(location7.href).toBe('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect(location7.origin).toBe('');

        const location8 = new URLParse('file:///foo/bar');

        expect(location8.protocol).toBe('file:');
        expect(location8.username).toBe('');
        expect(location8.password).toBe('');
        expect(location8.host).toBe('');
        expect(location8.hostname).toBe('');
        expect(location8.port).toBe(null);
        expect(location8.pathname).toBe('/foo/bar');
        expect(location8.search).toBe('');
        expect(location8.query).toEqual({});
        expect(location8.hash).toBe('');
        expect(location8.href).toBe('file:///foo/bar');
        expect(location8.origin).toBe('');

        const location9 = new URLParse('file:///');

        expect(location9.protocol).toBe('file:');
        expect(location9.username).toBe('');
        expect(location9.password).toBe('');
        expect(location9.host).toBe('');
        expect(location9.hostname).toBe('');
        expect(location9.port).toBe(null);
        expect(location9.pathname).toBe('/');
        expect(location9.search).toBe('');
        expect(location9.query).toEqual({});
        expect(location9.hash).toBe('');
        expect(location9.href).toBe('file:///');
        expect(location9.origin).toBe('');

        const location10 = new URLParse();

        expect(location10.protocol).toBe('');
        expect(location10.username).toBe('');
        expect(location10.password).toBe('');
        expect(location10.host).toBe('');
        expect(location10.hostname).toBe('');
        expect(location10.port).toBe(null);
        expect(location10.pathname).toBe('');
        expect(location10.search).toBe('');
        expect(location10.query).toEqual({});
        expect(location10.hash).toBe('');
        expect(location10.href).toBe('');
        expect(location10.origin).toBe('');
    });

    test('no slash in pathname', () => {
        expect(new URLParse('http://example.com').pathname).toBe('');
        expect(new URLParse('http://example.com/').pathname).toBe('');
    });

    test('no default protocol', () => {
        expect(new URLParse('http://example.com:80').toString()).toBe('http://example.com');
        expect(new URLParse('ws://example.com:80').toString()).toBe('ws://example.com');
        expect(new URLParse('https://example.com:443').toString()).toBe('https://example.com');
        expect(new URLParse('wss://example.com:443').toString()).toBe('wss://example.com');
        expect(new URLParse('ftp://example.com:21').toString()).toBe('ftp://example.com');
    });

    test('correct host after removing default protocol', () => {
        expect(new URLParse('http://example.com:80').host).toBe('example.com');
        expect(new URLParse('ws://example.com:80').host).toBe('example.com');
        expect(new URLParse('https://example.com:443').host).toBe('example.com');
        expect(new URLParse('wss://example.com:443').host).toBe('example.com');
        expect(new URLParse('ftp://example.com:21').host).toBe('example.com');
    });

    test('add colon mark', () => {
        const location = new URLParse('http://example.com');
        location.protocol = 'https';

        expect(location.toString()).toBe('https://example.com');
    });

    test('add question mark', () => {
        const location = new URLParse('http://example.com');
        location.search = 'foo=bar';

        expect(location.toString()).toBe('http://example.com/?foo=bar');
    });

    test('add hash mark', () => {
        const location = new URLParse('http://example.com');
        location.hash = 'foo';

        expect(location.toString()).toBe('http://example.com/#foo');
    });
});
