import { queryParse, queryStringify } from '../querystring';

describe('querystring', () => {
    describe('queryParse', () => {
        test('allows empty values', () => {
            expect(queryParse('')).toEqual({});
            expect(queryParse(null)).toEqual({});
            expect(queryParse(undefined)).toEqual({});
        });

        test('parses a query string', () => {
            expect(queryParse('foo=bar')).toEqual({ foo: 'bar' });
            expect(queryParse('foo=')).toEqual({ foo: '' });
        });

        test('parses multiple query string', () => {
            expect(queryParse('foo=bar&key=val')).toEqual({ foo: 'bar', key: 'val' });
            expect(queryParse('foo=bar&key=')).toEqual({ foo: 'bar', key: '' });
        });

        test('parses nested parameters', () => {
            expect(queryParse('foo[bar]=baz')).toEqual({ foo: { bar: 'baz' } });
            expect(queryParse('foo[bar][baz]=foobarbaz')).toEqual({ foo: { bar: { baz: 'foobarbaz' } } });
        });

        test('parses query string without a value', () => {
            expect(queryParse('foo')).toEqual({ foo: null });
            expect(queryParse('foo', { strictNullHandling: false })).toEqual({ foo: '' });
            expect(queryParse('foo&bar')).toEqual({ foo: null, bar: null });
            expect(queryParse('foo&bar', { strictNullHandling: false })).toEqual({ foo: '', bar: '' });
            expect(queryParse('foo=bar&baz')).toEqual({ foo: 'bar', baz: null });
            expect(queryParse('foo=bar&baz', { strictNullHandling: false })).toEqual({ foo: 'bar', baz: '' });
        });

        test('parses an explicit array', () => {
            expect(queryParse('a[]=b')).toEqual({ a: ['b'] });
            expect(queryParse('a[]=b&a[]=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a[]=b&a[]=c&a[]=d')).toEqual({ a: ['b', 'c', 'd'] });
        });

        test('parses a mix of simple and explicit arrays', () => {
            expect(queryParse('a=b&a[]=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a[]=b&a=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a[0]=b&a=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a=b&a[0]=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a[1]=b&a=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a=b&a[1]=c')).toEqual({ a: ['b', 'c'] });
            expect(queryParse('a=b&a[]=c')).toEqual({ a: ['b', 'c'] });
        });

        test('parses a nested array', () => {
            expect(queryParse('a[b][]=c&a[b][]=d')).toEqual({ a: { b: ['c', 'd'] } });
            expect(queryParse('a[b][0][foo]=c&a[b][1][foo]=d')).toEqual({ a: { b: [{ foo: 'c' }, { foo: 'd' }] } });
        });

        test('transforms arrays to objects', () => {
            expect(queryParse('foo[0]=bar&foo[bad]=baz')).toEqual({ foo: { 0: 'bar', bad: 'baz' } });
            expect(queryParse('foo[bad]=baz&foo[0]=bar')).toEqual({ foo: { bad: 'baz', 0: 'bar' } });
            expect(queryParse('foo[bad]=baz&foo[]=bar')).toEqual({ foo: { bad: 'baz', 0: 'bar' } });
            expect(queryParse('foo[]=bar&foo[bad]=baz')).toEqual({ foo: { 0: 'bar', bad: 'baz' } });
            expect(queryParse('foo[bad]=baz&foo[]=bar&foo[]=foo')).toEqual({ foo: { bad: 'baz', 0: 'bar', 1: 'foo' } });
            expect(queryParse('foo[0][a]=a&foo[0][b]=b&foo[1][a]=aa&foo[1][b]=bb')).toEqual({ foo: [{ a: 'a', b: 'b' }, { a: 'aa', b: 'bb' }] });
        });

        test('correctly prunes undefined values when converting an array to an object', () => {
            expect(queryParse('a[2]=b&a[99999999]=c')).toEqual({ a: { 2: 'b', 99999999: 'c' } });
        });

        test('parses arrays of objects', () => {
            expect(queryParse('a[][b]=c')).toEqual({ a: [{ b: 'c' }] });
            expect(queryParse('a[0][b]=c')).toEqual({ a: [{ b: 'c' }] });
        });

        test('URI decode', () => {
            expect(queryParse('foo=bar%20baz')).toEqual({ foo: 'bar baz' });
            expect(queryParse('foo=bar%21%27%28%29%2Abaz')).toEqual({ foo: 'bar!\'()*baz' });
        });
    });

    describe('queryStringify', () => {
        test('should encode simple objects', () => {
            expect(queryStringify({})).toBe('');
            expect(queryStringify({ a: 'b' })).toBe('a=b');
            expect(queryStringify({ a: 'b', c: 'd' })).toBe('a=b&c=d');
        });

        test('different types', () => {
            expect(queryStringify('')).toBe('');
            expect(queryStringify([])).toBe('');
            expect(queryStringify(0)).toBe('');
        });

        test('nested objects', () => {
            expect(queryStringify({ a: { b: 'c' } })).toBe('a[b]=c');

            expect(queryStringify({
                a: {
                    b: {
                        c: 'd',
                        e: 'f'
                    },
                    foo: {
                        bar: 'baz'
                    }
                }
            })).toBe('a[b][c]=d&a[b][e]=f&a[foo][bar]=baz');
        });

        test('handle array value', () => {
            expect(queryStringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'repeat' })).toBe('a=b&a=c&a=d');
            expect(queryStringify({ a: [{ b: 'c' }, { b: 'd' }] }, { arrayFormat: 'repeat' })).toBe('a[b]=c&a[b]=d');
            expect(queryStringify({ a: [{ b: ['c', 'd'] }] }, { arrayFormat: 'repeat' })).toBe('a[b]=c&a[b]=d');

            expect(queryStringify({ a: ['b', 'c', 'd'] })).toBe('a[0]=b&a[1]=c&a[2]=d');
            expect(queryStringify({ a: [{ b: 'c' }, { b: 'd' }] })).toBe('a[0][b]=c&a[1][b]=d');
            expect(queryStringify({ a: [{ b: ['c', 'd'] }] })).toBe('a[0][b][0]=c&a[0][b][1]=d');
        });

        test('handle empty array value', () => {
            expect(queryStringify({ a: 'b', foo: [] })).toBe('a=b');
        });

        test('handle undefined values in array', () => {
            expect(queryStringify({ a: 'b', foo: [undefined] })).toBe('a=b');
        });

        test('handle null values in array', () => {
            expect(queryStringify({ a: 'b', foo: [null] }, { arrayFormat: 'repeat' })).toBe('a=b&foo');
            expect(queryStringify({ a: 'b', foo: { bar: [null] } }, { arrayFormat: 'repeat' })).toBe('a=b&foo[bar]');

            expect(queryStringify({ a: 'b', foo: [null] })).toBe('a=b&foo[0]');
            expect(queryStringify({ a: 'b', foo: { bar: [null] } })).toBe('a=b&foo[bar][0]');

            expect(queryStringify({ a: 'b', foo: [null] }, { strictNullHandling: false })).toBe('a=b&foo[0]=');
            expect(queryStringify({ a: 'b', foo: { bar: [null] } }, { strictNullHandling: false })).toBe('a=b&foo[bar][0]=');
        });

        test('handle undefined and null values in array', () => {
            expect(queryStringify({ a: 'b', foo: [undefined, null, 'bar'] }, { arrayFormat: 'repeat' })).toBe('a=b&foo&foo=bar');
            expect(queryStringify({
                a: 'b',
                foo: {
                    bar: [undefined, null, 'baz']
                }
            }, { arrayFormat: 'repeat' })).toBe('a=b&foo[bar]&foo[bar]=baz');

            expect(queryStringify({ a: 'b', foo: [undefined, null, 'bar'] })).toBe('a=b&foo[1]&foo[2]=bar');
            expect(queryStringify({
                a: 'b',
                foo: {
                    bar: [undefined, null, 'baz']
                }
            })).toBe('a=b&foo[bar][1]&foo[bar][2]=baz');
        });

        test('array stringify representation with array brackets', () => {
            expect(queryStringify({
                foo: ['bar', 'baz', 'baf']
            }, { arrayFormat: 'brackets' })).toBe('foo[]=bar&foo[]=baz&foo[]=baf');
        });

        test('array stringify representation with array indexes', () => {
            expect(queryStringify({
                foo: ['bar', 'baz', 'baf']
            }, { arrayFormat: 'indices' })).toBe('foo[0]=bar&foo[1]=baz&foo[2]=baf');
        });

        test('array stringify representation with array indexes and sparse array', () => {
            const a = ['bar', 'baz'];
            a[10] = 'baf';

            expect(queryStringify({
                foo: ['bar', 'baz', 'baf']
            }, { arrayFormat: 'indices' })).toBe('foo[0]=bar&foo[1]=baz&foo[2]=baf');
        });

        test('URI encode', () => {
            expect(queryStringify({ 'foo bar': 'baz faz' })).toBe('foo bar=baz%20faz');
            expect(queryStringify({ 'foo!\'()*bar': 'baz!\'()*faz' })).toBe('foo!\'()*bar=baz%21%27%28%29%2Afaz');
        });

        test('no encoding', () => {
            expect(queryStringify({ 'foo:bar': 'baz:faz' }, { encode: false })).toBe('foo:bar=baz:faz');
            expect(queryStringify({ 'foo!\'()*bar': 'baz!\'()*faz' }, { encode: false })).toBe('foo!\'()*bar=baz!\'()*faz');
        });

        test('should not encode undefined values', () => {
            expect(queryStringify({ 'a': 'b', c: undefined })).toBe('a=b');
        });

        test('should encode null values as just a key', () => {
            expect(queryStringify({ 'a': 'b', c: null })).toBe('a=b&c');
            expect(queryStringify({ 'a': 'b', c: null }, { strictNullHandling: false })).toBe('a=b&c=');
        });
    });
});
